import User from '../models/userModel.mjs';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync.mjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.mjs';
import Token from '../models/tokenModel.mjs';
import dayjs from 'dayjs';
import mongoose from 'mongoose';
const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  });

const createSendToken = catchAsync(async (user, statusCode, res) => {
  const token = signAccessToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.refreshToken = await generateRefreshToken(user._id);
  const refreshOptions = {
    expires: new Date(
      Date.now() + process.env.REFRESH_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie('refreshToken', user.refreshToken, refreshOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const generateRefreshToken = async (id) => {
  const refreshToken = signRefreshToken(id);
  await Token.findOneAndUpdate(
    {
      user_id: mongoose.Types.ObjectId(id),
    },
    {
      expires_at: dayjs().subtract(1, 'second').format(),
      last_used_at: dayjs().subtract(1, 'second').format(),
    }
  );
  await Token.create({
    token: refreshToken,
    user_id: mongoose.Types.ObjectId(id),
    expires_at: dayjs().add(365 * 24 * 60 * 1000),
    type: 'REFRESH',
  });

  return refreshToken;
};

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
  next();
});

export const handleRefreshToken = catchAsync(async (req, res, next) => {
  const token = getRefreshToken(req);
  const tokenObj = await Token.findOne({
    token,
    type: 'REFRESH',
  });

  if (!tokenObj.token) {
    return next(new AppError('Invalid refresh token', 401));
  }
  const decoded = await promisify(jwt.verify)(
    tokenObj.token,
    process.env.REFRESH_JWT_SECRET
  );
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('Your not logged in, Please log in to get access', 401)
    );
  }

  if (tokenObj.last_used_at) {
    await tokenObj.updateOne(
      { token: tokenObj.token },
      {
        compromised_at: dayjs().format(),
      }
    );
    User.updateOne(
      { _id: currentUser._id },
      {
        blocked_at: dayjs().format(),
      }
    );
    // TODO
    // email support about compromised user
    return next(new AppError('Your account is temporarily disabled.', 401));
  }

  await tokenObj.updateOne(
    { token: tokenObj.token },
    {
      expires_at: dayjs().subtract(1, 'second').format(),
      last_used_at: dayjs().subtract(1, 'second').format(),
    }
  );

  createSendToken(currentUser, 201, res);
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

export const getToken = (req) => {
  let token;
  const authHeaders = req.headers.authorization;
  if (authHeaders && authHeaders.startsWith('Bearer')) {
    token = authHeaders.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  return token;
};

export const getRefreshToken = (req) => {
  let token;
  const authHeaders = req.headers.authorization;
  if (authHeaders && authHeaders.startsWith('Bearer')) {
    token = authHeaders.split(' ')[1];
  } else if (req.cookies.refreshToken) {
    token = req.cookies.refreshToken;
  }
  return token;
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.clearCookie('refreshToken');
  res.redirect('/login');
};
