
const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');

// User routes
router.get('/', getUsers);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
