const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cors = require('cors');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://siddhujaykay2:shiine1984@synergy.en8nmpm.mongodb.net/main', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
app.use('/users', usersRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
