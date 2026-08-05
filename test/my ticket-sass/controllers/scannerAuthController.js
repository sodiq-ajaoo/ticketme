const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const Scanner = require('../models/scannerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id, role: 'scanner' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (scanner, statusCode, res) => {
  const token = signToken(scanner._id);

  scanner.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      scanner,
    },
  });
};

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(new AppError('Please provide email and password.', 400));
//   }

//   const scanner = await Scanner.findOne({ email }).select('+password');
//   console.log(scanner);

//   if (
//     !scanner ||
//     !(await scanner.correctPassword(password, scanner.password))
//   ) {
//     return next(new AppError('Incorrect email or password.', 401));
//   }

//   if (!scanner.active) {
//     return next(new AppError('Scanner account is disabled.', 403));
//   }

//   createSendToken(scanner, 200, res);
// });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // Find scanner
  const scanner = await Scanner.findOne({ email }).select('+password');

  console.log('Scanner found:', scanner);

  if (
    !scanner ||
    !(await scanner.correctPassword(password, scanner.password))
  ) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  if (!scanner.active) {
    return next(new AppError('Scanner account is disabled.', 403));
  }

  console.log('Scanner ID:', scanner._id.toString());

  createSendToken(scanner, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log('====== SCANNER PROTECT RUNNING ======');
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in as a scanner.', 401));
  }

  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // const scanner = await Scanner.findById(decoded.id);

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log('Decoded token:', decoded);

  const scanner = await Scanner.findById(decoded.id);

  console.log('Scanner found:', scanner);

  if (!scanner) {
    return next(new AppError('Scanner no longer exists.', 401));
  }

  if (!scanner.active) {
    return next(new AppError('Scanner account is disabled.', 403));
  }

  req.scanner = scanner;

  next();
});

// console.log('Scanner ID:', scanner._id.toString());

// const token = signToken(scanner._id);
// console.log('Scanner Token:', token);

// return res.status(200).json({
//   status: 'success',
//   token,
//   data: {
//     scanner,
//   },
// });
