require('dotenv').config();

const PORT = process.env.PORT; // use env port if available (e.g. when hosted)
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = { MONGODB_URI, PORT };
