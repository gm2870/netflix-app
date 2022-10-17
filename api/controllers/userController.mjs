import User from '../models/userModel.mjs';

export const checkEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).json({ status: 'error', message: 'Email already exists.' });
  } else {
    res.status(200).json({ status: 'success' });
  }
};
