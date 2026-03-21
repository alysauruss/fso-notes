const mongoose = require('mongoose');

// define the shape of a note document in MongoDB
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 5,
      required: true,
    },
    important: Boolean,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// customize how note documents are serialized to JSON
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // expose _id as a plain string id
    // ? is optional chaining.means "only call this method if the value is not null or undefined.

    // if (
    //   returnedObject.user &&
    //   typeof returnedObject.user === 'object' &&
    //   !returnedObject.user._bsontype
    // ) {
    //   // already a populated plain object, leave it alone
    // } else {
    //   returnedObject.user = returnedObject.user?.toString();
    // }

    returnedObject.createdAt = returnedObject.createdAt?.toISOString();
    returnedObject.updatedAt = returnedObject.updatedAt?.toISOString();
    delete returnedObject._id; // remove the mongo internal _id field
    delete returnedObject.__v; // remove the mongo versioning field
  },
});

// creates the 'notes' collection in MongoDB
module.exports = mongoose.model('Note', noteSchema);
