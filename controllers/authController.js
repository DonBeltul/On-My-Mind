const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (usuario, statusCode, res) => {
  const token = signToken(usuario._id);
  res.status(statusCode).json({
    status: 'sucess',
    token,
    data: {
      usuario
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUsuario = await Usuario.create({
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    email: req.body.email,
    dni: req.body.dni,
    numColegiado: req.body.numColegiado,
    telefono:req.body.telefono,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUsuario, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError('Please provide email and password', 400));
  }
  const usuario = await Usuario.findOne({ email }).select('+password');

  if (!usuario || !(await usuario.correctPassword(password, usuario.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(usuario._id,200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const usuario = await Usuario.findById(decoded.id);
  if (!usuario) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  if (usuario.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  req.usuario = usuario;
  next(); //Grant access to protected route
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
  };
};
exports.forgotPassword = async (req, res, next) => {
  const usuario = await Usuario.findOne({ email: req.body.email });
  if (!usuario) {
    return next(new AppError('There is no user with email address', 404));
  }

  const resetToken = usuario.createPasswordResetToken();
  await usuario.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/usuarios/resetTokenPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn´t orget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    usuario.passwordResetToken = undefined;
    usuario.passwordResetTokenExpires = undefined;
    await usuario.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
};
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const usuario = await Usuario.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  if (!usuario) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  usuario.password = req.body.password;
  usuario.passwordConfirm = req.body.passwordConfirm;
  usuario.passwordResetToken = undefined;
  usuario.passwordResetTokenExpires = undefined;
  await usuario.save();

  createSendToken(usuario._id, 200,res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario.id).select('+password');

  if (!(await usuario.correctPassword(req.body.passwordCurrent, usuario.password))) {
    return next(new AppError('The password is incorrect', 401));
  }

  usuario.password = req.body.password;
  usuario.passwordConfirm = req.body.passwordConfirm;
  await usuario.save();

  createSendToken(usuario, 200, res);
});
