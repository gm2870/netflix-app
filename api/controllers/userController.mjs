import User from '../models/userModel.mjs';
import { getOne } from './handleFactory.mjs';
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = getOne(User);
