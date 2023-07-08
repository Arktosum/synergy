const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Successful login
    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user data from the database based on the userId
    // Replace the code below with your own logic to fetch and send the user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search/:pattern', async (req, res) => {
  const pattern = req.params.pattern;
  const regex = new RegExp(pattern, 'i');

  let users
  try{
    users = await User.find({ username: regex }).limit(20);
  }
  catch(error){
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.json(users);

});


// API endpoint to send a friend request
router.post('/requests/send', async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    // Check if both sender and receiver exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if friend request already exists
    const existingRequest = receiver.requests.find(request =>
      request.requester.equals(senderId) && request.type === 'incoming'
    );

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    // Create friend request
    const friendRequest = {
      requester: senderId,
      type: 'incoming',
      status: 'pending'
    };

    receiver.requests.push(friendRequest);
    sender.requests.push({
      requester: receiverId,
      type: 'outgoing',
      status: 'pending'
    });

    await Promise.all([receiver.save(), sender.save()]);

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// API endpoint to fetch requests for a specific user
router.get('/requests/read/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user with the given ID and populate only the requests field
    const user = await User.findById(userId).populate({
      path: 'requests',
      populate: {
        path: 'requester',
        select: 'username email'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.requests);
  } catch (error) {
    console.error('Error fetching user requests', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/requests/cancel', async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    console.log(req.body);

    // Find the sender and update their requests array
    const sender = await User.findByIdAndUpdate(senderId, {
      $pull: { requests: { requester: receiverId } 
    }});

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    // Find the receiver and update their requests array
    const receiver = await User.findOneAndUpdate(receiverId, {
      $pull: { requests: { requester: senderId }
    }});

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    res.json({ message: 'Request canceled successfully' });
  } catch (error) {
    console.error('Error canceling request', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
