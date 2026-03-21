const Note = require('../models/note');
const User = require('../models/user');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    createdAt: '2026-03-21T17:29:21.830Z',
    updatedAt: '2026-03-21T17:29:21.830Z',
    user: '69becb8c309fab270e9b7cdc',
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
    createdAt: '2026-03-21T17:29:21.830Z',
    updatedAt: '2026-03-21T17:29:21.830Z',
    user: '69becb8c309fab270e9b7cdc',
  },
];

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

// const notesInDb = async () => {
//   const notes = await Note.find({});
//   return notes.map((note) => note.toJSON());
// };

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => {
    const obj = note.toJSON();
    obj.user = obj.user?.toString(); // convert user ObjectId to string for easier comparison in tests
    return obj;
  });
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
};
