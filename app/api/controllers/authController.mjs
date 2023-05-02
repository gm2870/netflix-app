import User from '../models/userModel.mjs';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync.mjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.mjs';
import Token from '../models/tokenModel.mjs';
import dayjs from 'dayjs';
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = catchAsync(async (user, statusCode, res) => {
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
});

export const checkEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).json({ status: 'error', message: 'Email already exists.' });
  } else {
    res.status(200).json({ status: 'success' });
  }
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
  const token = getToken(req);
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

export const refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.jwt;
  const dbToken = await Token.findOne({
    token: refreshToken,
    type: 'REFRESH',
  });
  if (!dbToken) {
    return next(
      new AppError('Invalid credentials, Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(dbToken, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.user_id);

  if (!currentUser) {
    return next(
      new AppError('Invalid credentials, Please log in to get access', 401)
    );
  }

  if (dbToken.last_used_at) {
    await dbToken.update({
      compromised_at: dayjs().format(),
    });
    currentUser.update({
      blocked_at: dayjs().format(),
    });
    // TODO
    // email support about compromised user
    return next(new AppError('Your account is temporarily disabled.', 401));
  }
  await dbToken.update({
    user_id: currentUser.id,
    expires_at: dayjs().subtract(1, 'second').format(),
    last_used_at: dayjs().subtract(1, 'second').format(),
  });
  const newRefreshToken = signToken(currentUser._id);
  await Token.create({
    token: newRefreshToken,
    user_id: currentUser._id,
    expires_at: dayjs().add(365 * 24 * 60 * 1000),
    type: 'REFRESH',
  });
  res.status(200).json({
    status: 'success',
    refreshToken: newRefreshToken,
    data: 'Refresh token updated',
  });
});

export const authorizedRedirect = catchAsync(async (req, res, next) => {
  const token = getToken(req);
  if (token) {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (currentUser) {
      res.redirect('/browse');
    }
  }
  next();
});

export const unauthorizedRedirect = catchAsync(async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    res.redirect('/login');
  }
  next();
});

const getToken = (req) => {
  let token;
  const authHeaders = req.headers.authorization;
  if (authHeaders && authHeaders.startsWith('Bearer')) {
    token = authHeaders.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  return token;
};

export const logout = (req, res) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      status: 'error',
      data: 'Unauthorized',
    });
  }

  res.clearCookie('jwt');

  res.redirect('/login');
};
