const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Sesion = require('../models/sesionModel');


exports.getSesiones = catchAsync(async(req, res, next) => {
    const feautures = new APIFeatures(Sesion.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const sesiones = await feautures.query;

  res.status(200).json({
    status: 'success',
    results: sesiones.length,
    data: {
        sesiones
    }
  });
})

exports.createSesion = catchAsync(async (req, res, next) => {
    const nuevaSesion = await Sesion.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        sesion: nuevaSesion
      }
    });
  });

exports.getSesion = catchAsync(async (req, res, next) => {
  const sesion = await Sesion.findById(req.params.id);

  if (!sesion) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      sesion
    }
  });
});

exports.modificarSesion = catchAsync(async (req, res, next) => {
    const sesion = await Sesion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!sesion) {
      return next(new AppError('No user found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        sesion
      }
    });
  });

exports.eliminarSesion = catchAsync(async (req, res, next) => {
    const sesion = await Sesion.findByIdAndDelete(req.params.id);
  
    if (!sesion) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });