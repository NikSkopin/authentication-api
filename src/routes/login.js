import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('here');

    const credentials = req.body;
    const user = await User.findOne({ email: credentials.email });
    if (user) {
      res.json({ success: true });
    }
  } catch (error) {
    res.status(403).json({
      error: 'The login information was incorrect',
    });
  }
});

export default router;
