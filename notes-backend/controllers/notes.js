const notesRouter = require('express').Router();
const Note = require('../models/note');

// get all notes
notesRouter.get('/', (request, response, next) => {
  Note.find({})
    .then((notes) => response.json(notes))
    .catch((error) => next(error));
});

// get a single note by id
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        return response.json(note);
      }
      return response.status(404).end();
    })
    .catch((error) => next(error));
});

// create a new note
notesRouter.post('/', (request, response, next) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  return note
    .save()
    .then((savedNote) => response.json(savedNote))
    .catch((error) => next(error));
});

// delete a note by id
notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

// update a note
notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body;
  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => response.json(updatedNote));
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
