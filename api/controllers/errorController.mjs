import AppError from '../utils/appError.mjs';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  // const value = err.errmsg.match(/(["" '])(\\?.])*?\1/)[0];
  // const message = `Duplicate Field value:${value}`;
  return new AppError(err.errmsg, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${error.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token,please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Expired token,please login again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something wen wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!.',
    });
  }
  res.status(err.statusCode).render('error', {
    title: 'Something wen wrong',
    msg: 'Please try again later',
  });
};

const globalErrorHandler = (err, req, res, next) => {
  console.log();
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDB(err);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
export default globalErrorHandler;
