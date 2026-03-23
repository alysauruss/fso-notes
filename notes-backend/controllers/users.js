const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

//get all
usersRouter.get('/', async (request, response) => {
  // const users = await User.find({}); // just shows note's ids
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1,
  }); // shows note objects instead of just their ids
  response.json(users);
});

// add
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!password) {
    return response.status(400).json({ error: 'password missing' });
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' });
  }

  if (!username) {
    return response.status(400).json({ error: 'username missing' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

// delete
usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = usersRouter;
