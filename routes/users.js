const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Message = require('../models/message');

// Get list of users
// GET / - Returns {users: [{username, first_name, last_name, phone}, ...]}
router.get('/', async (req, res) => {
    try {
      const users = await User.all();
      res.json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get detail of user
// GET /:username - Returns {user: {username, first_name, last_name, phone, join_at, last_login_at}}
router.get('/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.get(username);
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get messages to user
// GET /:username/to - Returns {messages: [{id, body, sent_at, read_at, from_user: {username, first_name, last_name, phone}}, ...]}
router.get('/:username/to', async (req, res) => {
    const { username } = req.params;
  
    try {
      const messagesTo = await Message.messagesTo(username); 
      res.json({ messages: messagesTo });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get messages from user
// GET /:username/from - Returns {messages: [{id, body, sent_at, read_at, to_user: {username, first_name, last_name, phone}}, ...]}
router.get('/:username/from', async (req, res) => {
    const { username } = req.params;
  
    try {
      const messagesFrom = await Message.messagesFrom(username); 
      res.json({ messages: messagesFrom });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
