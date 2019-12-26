import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const credentials = req.body;
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      return res.status(403).send({
        error: 'The login information was incorrect.',
      });
    }

    const isPasswordValid = await user.validPassword(credentials.password);
    if (!isPasswordValid) {
      return res.status(403).send({
        error: 'The password information was incorrect.'
      });
    }

    const userJson = user.toAuthJSON();
    res.send({
      email: userJson.email,
      token: userJson.token,
    });

  } catch (error) {
    res.status(403).json({
      error: 'The login information was incorrect',
    });
  }
});

export default router;
