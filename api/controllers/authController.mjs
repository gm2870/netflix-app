import User from '../models/userModel.mjs';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync.mjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.mjs';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return next(new AppError('Please provide password and email', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password is wrong', 401));
  }
  createSendToken(user, 200, res);
});

export const signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  const authHeaders = req.headers.authorization;
  if (authHeaders && authHeaders.startsWith('Bearer')) {
    token = authHeaders.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('Your not logged in, Please log in to get access', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exits', 401)
    );
  }
  req.user = currentUser;
  next();
});

export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      req.user = currentUser;
    } catch (error) {
      return next();
    }
  }
};
