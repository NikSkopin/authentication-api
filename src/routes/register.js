import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const credentials = req.body;
    const user = new User({
      email: credentials.email,
    });
    // TODO validate password
    user.setPassword(credentials.password);

    await user.save();
    res.send(user.toAuthJSON());
  } catch (error) {
    res.status(400).send({
      error: 'This email account is already in use.',
    });
  }
});

export default router;
