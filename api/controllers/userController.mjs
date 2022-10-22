import User from '../models/userModel.mjs';
import { getOne } from './handleFactory.mjs';
export const checkEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).json({ status: 'error', message: 'Email already exists.' });
  } else {
    res.status(200).json({ status: 'success' });
  }
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = getOne(User);
