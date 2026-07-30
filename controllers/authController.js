const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);

//   // Don't send password back to the client
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//     },
//   });
// };

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true;
  // }

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

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Generate verification token
  const verificationToken = newUser.createEmailVerificationToken();

  await newUser.save({ validateBeforeSave: false });

  const verifyURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/verify-email/${verificationToken}`;

  const message = `
                                    Hello ${newUser.name},

                                    Welcome to TicketMe!

                                    Please verify your email by clicking the link below:

                                    ${verifyURL}

                                    This link expires in 24 hours.

                                    Thank you,
                                    TicketMe Team
                                    `;

  await sendEmail({
    email: newUser.email,
    subject: 'Verify your TicketMe account',
    message,
  });

  res.status(201).json({
    status: 'success',
    message:
      'Account created successfully. Please check your email to verify your account.',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) Get email and password
  const { email, password } = req.body;

  // 2) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 3) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.emailVerified) {
    return next(
      new AppError('Please verify your email before logging in.', 401),
    );
  }

  // 4) Send JWT
  createSendToken(user, 200, res);
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Verification link is invalid or expired.', 400));
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully. You can now log in.',
  });
});

exports.resendVerificationEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  if (user.emailVerified) {
    return next(new AppError('Email is already verified.', 400));
  }

  const verificationToken = user.createEmailVerificationToken();

  await user.save({ validateBeforeSave: false });

  const verifyURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/verify-email/${verificationToken}`;

  const message = `
                                    Hello ${user.name},

                                    Click the link below to verify your TicketMe account:

                                    ${verifyURL}

                                    This link expires in 24 hours.

                                    Regards,
                                    TicketMe Team
                                    `;

  await sendEmail({
    email: user.email,
    subject: 'Verify your TicketMe account',
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Verification email sent successfully.',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log('====== USER PROTECT RUNNING ======');
  // 1) Get token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2) Check if token exists
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 3) Verify token
  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      new AppError('Invalid or expired token. Please log in again.', 401),
    );
  }

  // 4) Check user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // 5) Grant access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = ['admin', 'organizer']

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Prevent requesting another reset within 2 minutes
  if (
    user.passwordResetRequestedAt &&
    Date.now() - user.passwordResetRequestedAt.getTime() < 5 * 60 * 1000
  ) {
    return next(
      new AppError(
        'Please wait 5 minutes before requesting another password reset email.',
        429,
      ),
    );
  }

  // 3) Generate the reset token
  const resetToken = user.createPasswordResetToken();

  // 4) Save the request time
  user.passwordResetRequestedAt = Date.now();

  // 5) Save the hashed token and expiry date
  await user.save({ validateBeforeSave: false });

  // 6) Create the reset URL
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  // 7) Create the email message
  const message = `
                                    Hello ${user.name},

                                    We received a request to reset your TicketMe password.

                                    Click the link below to reset your password:

                                    ${resetURL}

                                    This link will expire in 10 minutes.

                                    If you did not request a password reset, you can safely ignore this email.

                                    Regards,
                                    TicketMe Team
                                    `;

  try {
    // 8) Send the email
    await sendEmail({
      email: user.email,
      subject: 'TicketMe Password Reset',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email!',
    });
  } catch (err) {
    console.log('EMAIL ERROR:', err);

    // Remove reset token if email fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetRequestedAt = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Hash the token from the URL
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) Find user by hashed token and check it hasn't expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 3) If no user found
  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  // 4) Set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 5) Save the user
  await user.save();

  // 6) Log the user in with a new JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the currently logged in user
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if the current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  // 3) Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) Log the user in again
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

///////////////////////////////////////////////////////////
// const jwt = require('jsonwebtoken');
// const { promisify } = require('util');
// const User = require('../models/userModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const sendEmail = require('../utils/email');
// const crypto = require('crypto');

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// // const createSendToken = (user, statusCode, res) => {
// //   const token = signToken(user._id);

// //   // Don't send password back to the client
// //   user.password = undefined;

// //   res.status(statusCode).json({
// //     status: 'success',
// //     token,
// //     data: {
// //       user,
// //     },
// //   });
// // };

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
//     ),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   };

//   // if (process.env.NODE_ENV === 'production') {
//   //   cookieOptions.secure = true;
//   // }

//   res.cookie('jwt', token, cookieOptions);

//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//     },
//   });
// };

// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm,
//   });

//   // Generate verification token
//   const verificationToken = newUser.createEmailVerificationToken();

//   await newUser.save({ validateBeforeSave: false });

//   const verifyURL = `${req.protocol}://${req.get(
//     'host',
//   )}/api/v1/users/verify-email/${verificationToken}`;

//   const message = `
// Hello ${newUser.name},

// Welcome to TicketMe!

// Please verify your email by clicking the link below:

// ${verifyURL}

// This link expires in 24 hours.

// Thank you,
// TicketMe Team
// `;

//   await sendEmail({
//     email: newUser.email,
//     subject: 'Verify your TicketMe account',
//     message,
//   });

//   res.status(201).json({
//     status: 'success',
//     message:
//       'Account created successfully. Please check your email to verify your account.',
//   });
// });

// exports.login = catchAsync(async (req, res, next) => {
//   // 1) Get email and password
//   const { email, password } = req.body;

//   // 2) Check if email and password exist
//   if (!email || !password) {
//     return next(new AppError('Please provide email and password!', 400));
//   }

//   // 3) Check if user exists && password is correct
//   const user = await User.findOne({ email }).select('+password');

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError('Incorrect email or password', 401));
//   }

//   if (!user.emailVerified) {
//     return next(
//       new AppError('Please verify your email before logging in.', 401),
//     );
//   }

//   // 4) Send JWT
//   createSendToken(user, 200, res);
// });

// exports.verifyEmail = catchAsync(async (req, res, next) => {
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await User.findOne({
//     emailVerificationToken: hashedToken,
//     emailVerificationExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new AppError('Verification link is invalid or expired.', 400));
//   }

//   user.emailVerified = true;
//   user.emailVerificationToken = undefined;
//   user.emailVerificationExpires = undefined;

//   await user.save({ validateBeforeSave: false });

//   res.status(200).json({
//     status: 'success',
//     message: 'Email verified successfully. You can now log in.',
//   });
// });

// exports.resendVerificationEmail = catchAsync(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new AppError('No user found with that email.', 404));
//   }

//   if (user.emailVerified) {
//     return next(new AppError('Email is already verified.', 400));
//   }

//   const verificationToken = user.createEmailVerificationToken();

//   await user.save({ validateBeforeSave: false });

//   const verifyURL = `${req.protocol}://${req.get(
//     'host',
//   )}/api/v1/users/verify-email/${verificationToken}`;

//   const message = `
// Hello ${user.name},

// Click the link below to verify your TicketMe account:

// ${verifyURL}

// This link expires in 24 hours.

// Regards,
// TicketMe Team
// `;

//   await sendEmail({
//     email: user.email,
//     subject: 'Verify your TicketMe account',
//     message,
//   });

//   res.status(200).json({
//     status: 'success',
//     message: 'Verification email sent successfully.',
//   });
// });

// exports.protect = catchAsync(async (req, res, next) => {
//   // 1) Get token
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }

//   // 2) Check if token exists
//   if (!token) {
//     return next(
//       new AppError('You are not logged in! Please log in to get access.', 401),
//     );
//   }

//   // 3) Verify token
//   // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   let decoded;

//   try {
//     decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   } catch (err) {
//     return next(
//       new AppError('Invalid or expired token. Please log in again.', 401),
//     );
//   }

//   // 4) Check user still exists
//   const currentUser = await User.findById(decoded.id);

//   if (!currentUser) {
//     return next(
//       new AppError('The user belonging to this token no longer exists.', 401),
//     );
//   }

//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     return next(
//       new AppError('User recently changed password! Please log in again.', 401),
//     );
//   }

//   // 5) Grant access
//   req.user = currentUser;
//   next();
// });

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     // roles = ['admin', 'organizer']

//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError('You do not have permission to perform this action', 403),
//       );
//     }

//     next();
//   };
// };

// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on the email
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new AppError('There is no user with that email address.', 404));
//   }

//   // 2) Prevent requesting another reset within 2 minutes
//   if (
//     user.passwordResetRequestedAt &&
//     Date.now() - user.passwordResetRequestedAt.getTime() < 5 * 60 * 1000
//   ) {
//     return next(
//       new AppError(
//         'Please wait 5 minutes before requesting another password reset email.',
//         429,
//       ),
//     );
//   }

//   // 3) Generate the reset token
//   const resetToken = user.createPasswordResetToken();

//   // 4) Save the request time
//   user.passwordResetRequestedAt = Date.now();

//   // 5) Save the hashed token and expiry date
//   await user.save({ validateBeforeSave: false });

//   // 6) Create the reset URL
//   const resetURL = `${req.protocol}://${req.get(
//     'host',
//   )}/api/v1/users/resetPassword/${resetToken}`;

//   // 7) Create the email message
//   const message = `
// Hello ${user.name},

// We received a request to reset your TicketMe password.

// Click the link below to reset your password:

// ${resetURL}

// This link will expire in 10 minutes.

// If you did not request a password reset, you can safely ignore this email.

// Regards,
// TicketMe Team
// `;

//   try {
//     // 8) Send the email
//     await sendEmail({
//       email: user.email,
//       subject: 'TicketMe Password Reset',
//       message,
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Password reset link sent to your email!',
//     });
//   } catch (err) {
//     console.log('EMAIL ERROR:', err);

//     // Remove reset token if email fails
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     user.passwordResetRequestedAt = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(
//       new AppError(
//         'There was an error sending the email. Please try again later.',
//         500,
//       ),
//     );
//   }
// });

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   // 1) Hash the token from the URL
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   // 2) Find user by hashed token and check it hasn't expired
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 3) If no user found
//   if (!user) {
//     return next(new AppError('Token is invalid or has expired.', 400));
//   }

//   // 4) Set the new password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;

//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;

//   // 5) Save the user
//   await user.save();

//   // 6) Log the user in with a new JWT
//   createSendToken(user, 200, res);
// });

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1) Get the currently logged in user
//   const user = await User.findById(req.user.id).select('+password');

//   // 2) Check if the current password is correct
//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError('Your current password is incorrect.', 401));
//   }

//   // 3) Update the password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;

//   await user.save();

//   // 4) Log the user in again
//   createSendToken(user, 200, res);
// });

// exports.logout = (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });

//   res.status(200).json({
//     status: 'success',
//     message: 'Logged out successfully',
//   });
// };
