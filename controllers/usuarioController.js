const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Usuario = require('../models/usuarioModel');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const feautures = new APIFeatures(Usuario.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const usuarios = await feautures.query;

  res.status(200).json({
    status: 'success',
    results: usuarios.length,
    data: {
      usuarios
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUsuario = await Usuario.findByIdAndUpdate(req.usuario.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'sucess',
    data: {
      user: updatedUsuario
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Usuario.findByIdAndUpdate(req.usuario.id, { active: false });

  res.status(204).json({
    status: 'success'
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findById(req.params.id);

  if (!usuario) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
        usuario
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUsuario = await Usuario.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      usuario: newUsuario
    }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!usuario) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
        usuario
    }
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findByIdAndDelete(req.params.id);

  if (!usuario) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
