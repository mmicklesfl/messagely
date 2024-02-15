const express = require('express');
const router = express.Router();
const Message = require('../models/message'); 


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (
      message.to_user.toString() !== req.user._id.toString() &&
      message.from_user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', async (req, res) => {
  const { to_username, body } = req.body;

  try {
    const toUser = await User.findOne({ username: to_username });
    if (!toUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const message = new Message({
      from_user: req.user._id,
      to_user: toUser._id,
      body,
      sent_at: Date.now(),
    });

    await message.save();

    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.to_user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    message.read_at = Date.now();
    await message.save();

    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;