const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Cita = require('../models/citaModel');


exports.getCitas = catchAsync(async(req, res, next) => {
    const feautures = new APIFeatures(Cita.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const citas = await feautures.query;

  res.status(200).json({
    status: 'success',
    results: sesiones.length,
    data: {
        citas
    }
  });
})

exports.createCita = catchAsync(async (req, res, next) => {
    const nuevaCita = await Cita.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        cita: nuevaCita
      }
    });
  });

exports.getCita = catchAsync(async (req, res, next) => {
    const cita = await Cita.findById(req.params.id);
  
    if (!cita) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        cita
      }
    });
  });

exports.modificarCita = catchAsync(async (req, res, next) => {
    const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!sesion) {
      return next(new AppError('No user found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        cita
      }
    });
  });

exports.eliminarCita = catchAsync(async (req, res, next) => {
    const cita = await Cita.findByIdAndDelete(req.params.id);
  
    if (!cita) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });