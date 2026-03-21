const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'username must be at least 3 characters long'],
    required: true,
    unique: true,
    match: [/^[a-zA-Z]+$/, 'username must be consisted of only letters'],
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
