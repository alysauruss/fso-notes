const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Note = require('../models/note');
const User = require('../models/user');

// supertest wraps our express app so we can make HTTP requests to it
// without actually starting a real server on a port
const api = supertest(app);

// ------------------------------------------------------------------
// TOP-LEVEL DESCRIBE BLOCK
// Groups all tests that assume the DB already has some notes in it.
// Think of describe() as a folder — it organizes related tests together.
// ------------------------------------------------------------------
describe('when there is initially some notes saved', () => {
  // beforeEach runs before EVERY single test inside this describe block.
  // It wipes the test database clean, then inserts our known seed data.
  // This guarantees every test starts from the exact same state,
  // so tests don't accidentally affect each other.
  let token;
  beforeEach(async () => {
    await Note.deleteMany({}); // wipe everything
    await Note.insertMany(helper.initialNotes); // insert fresh seed data

    // create a fresh test user and log in to get a token
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('testpassword', 10);
    await new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash,
    }).save();

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' });

    token = loginResponse.body.token;
  });

  // Basic sanity check: does GET /api/notes return 200 and JSON?
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  // Checks that the number of notes returned matches what we seeded.
  // If this fails, something is wrong with the GET route or beforeEach.
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  // Checks that a known piece of content from our seed data actually
  // shows up in the response. Confirms the data isn't garbled.
  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map((e) => e.content);
    assert(contents.includes('HTML is easy'));
  });

  // ------------------------------------------------------------------
  // NESTED DESCRIBE: viewing a specific note
  // Groups tests for the GET /api/notes/:id route.
  // ------------------------------------------------------------------
  describe('viewing a specific note', () => {
    // Happy path — fetch a real note by its actual MongoDB id.
    // Uses notesInDb() to get the real id (not a hardcoded fake one).
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToView = notesAtStart[0]; // grab the first seeded note

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      // deepStrictEqual checks that every field matches, not just reference equality
      assert.deepStrictEqual(resultNote.body, noteToView);
    });

    // Edge case — a valid MongoDB ObjectId format, but the note was
    // already deleted. The server should say 404 Not Found.
    // nonExistingId() creates a note, saves it, deletes it, then
    // returns its id — so the id is real but the document is gone.
    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });

    // Edge case — a completely malformed id (wrong length/format).
    // MongoDB can't even parse it, so it should return 400 Bad Request.
    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'; // intentionally malformed

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  // ------------------------------------------------------------------
  // NESTED DESCRIBE: addition of a new note
  // Groups tests for the POST /api/notes route.
  // ------------------------------------------------------------------
  describe('addition of a new note', () => {
    // Happy path — send a valid note, expect 201 Created,
    // then confirm the total count went up by 1 and the content is in the DB.
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      };

      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`) // set the token in the header
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      //debugging, do const response = await api above. will show the actual vs expected response
      // assert.strictEqual(
      //   response.status,
      //   201,
      //   `server responded with: ${JSON.stringify(response.body)}`,
      // );
      // assert.match(response.headers['content-type'], /application\/json/);

      const notesAtEnd = await helper.notesInDb();
      // count should have increased by exactly 1
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

      // the new note's content should actually be in the DB
      const contents = notesAtEnd.map((n) => n.content);
      assert(contents.includes('async/await simplifies making async calls'));
    });

    // Sad path — send a note missing the required 'content' field.
    // Server should reject it with 400, and the DB count should not change.
    test('fails with status code 400 if data invalid', async () => {
      const newNote = { important: true }; // missing required 'content'

      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(400);

      const notesAtEnd = await helper.notesInDb();

      // count should be unchanged — bad request shouldn't save anything
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });

    test('fails with 401 if token missing', async () => {
      const newNote = {
        content: 'this should fail',
        important: true,
      };

      await api
        .post('/api/notes')
        .send(newNote) // no token attached
        .expect(401);
    });

    test('fails with 401 when token is expired', async () => {
      // create an already-expired token
      const expiredToken = jwt.sign(
        { username: 'testuser', id: 'someid' },
        process.env.SECRET,
        { expiresIn: -1 }, // already expired
      );

      const newNote = { content: 'this should fail', important: true };

      const result = await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(newNote)
        .expect(401);

      assert(result.body.error.includes('token expired'));
    });

    test('created note is linked to the authenticated user', async () => {
      const newNote = { content: 'checking user link', important: true };

      const response = await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(201);

      // check the returned note has a user field
      assert(response.body.user);

      // verify it matches the logged in user
      const users = await helper.usersInDb();
      const testUser = users.find((u) => u.username === 'testuser');
      assert.strictEqual(response.body.user, testUser.id);
    });
  });

  describe('updating a note', () => {
    test('succeeds with updating valid data', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToUpdate = notesAtStart[0];

      const updatedNoteData = {
        content: 'Updated Content',
        important: noteToUpdate.important,
      };

      await api
        .put(`/api/notes/${noteToUpdate.id}`)
        .send(updatedNoteData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const notesAtEnd = await helper.notesInDb();
      const updatedNote = notesAtEnd.find((n) => n.id === noteToUpdate.id);

      assert.strictEqual(updatedNote.content, 'Updated Content');
    });

    test('fails with status code 400 if updated data invalid', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToUpdate = notesAtStart[0];

      const invalidUpdatedNoteData = {
        content: '',
      };

      await api
        .put(`/api/notes/${noteToUpdate.id}`)
        .send(invalidUpdatedNoteData)
        .expect(400);

      const notesAtEnd = await helper.notesInDb();
      const unchangedNote = notesAtEnd.find((n) => n.id === noteToUpdate.id);

      assert.strictEqual(unchangedNote.content, noteToUpdate.content);
    });
  });

  // ------------------------------------------------------------------
  // NESTED DESCRIBE: deletion of a note
  // Groups tests for the DELETE /api/notes/:id route.
  // ------------------------------------------------------------------
  describe('deletion of a note', () => {
    // Happy path — delete a real note and confirm:
    // 1. Response is 204 No Content
    // 2. The deleted note's id is no longer in the DB
    // 3. Total count dropped by 1
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToDelete = notesAtStart[0];

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

      const notesAtEnd = await helper.notesInDb();

      const ids = notesAtEnd.map((n) => n.id);
      assert(!ids.includes(noteToDelete.id)); // deleted id should be gone

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
    });
  });
});

// Runs once after ALL tests finish.
// Closes the mongoose connection so the test process can exit cleanly.
// Without this, the process would hang open indefinitely.
after(async () => {
  await mongoose.connection.close();
});

// npm test -- tests/note_api.test.js
// npm test -- --test-only
