import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const credentials = req.body;
    const user = new User({
      email: credentials.email,
      passwordHash: credentials.password,
    });

    const checkUser = User.find({ email: credentials.email });
    if (!checkUser) {
      await user.save((err, entry) => {
        if (err) return;
        res.send({
          message: `New user with email ${entry.email} was registered.`,
        });
      });
    } else {
      res.status(403).json({
        message: 'User is already registered',
      });
    }
  } catch (error) {
    res.status(400).send({
      message: 'Something went wrong. You were not registered.',
    });
  }
});

export default router;
