const mongoose = require('mongoose');

// define the shape of a note document in MongoDB
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

// customize how note documents are serialized to JSON
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // expose _id as a plain string id
    delete returnedObject._id; // remove the mongo internal _id field
    delete returnedObject.__v; // remove the mongo versioning field
  },
});

// creates the 'notes' collection in MongoDB
module.exports = mongoose.model('Note', noteSchema);
