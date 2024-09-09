const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Paciente = require('../models/pacienteModel');


exports.getPacientes = catchAsync(async(req, res, next) => {
    const feautures = new APIFeatures(Paciente.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const pacientes = await feautures.query;

  res.status(200).json({
    status: 'success',
    results: pacientes.length,
    data: {
        pacientes
    }
  });
})

exports.createPaciente = catchAsync(async (req, res, next) => {
    const nuevoPaciente = await Paciente.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        paciente: nuevoPaciente
      }
    });
  });

exports.getPaciente = catchAsync(async (req, res, next) => {
    const paciente = await Paciente.findById(req.params.id);
  
    if (!paciente) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        paciente
      }
    });
  });

exports.modificarPaciente = catchAsync(async (req, res, next) => {
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!paciente) {
      return next(new AppError('No user found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        paciente
      }
    });
  });

exports.eliminarPaciente = catchAsync(async (req, res, next) => {
    const paciente = await Paciente.findByIdAndDelete(req.params.id);
  
    if (!paciente) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.getPacientesCitas = catchAsync(async (req, res, next) => {
    //Salir una lista de pacientes con la citas de cada uno
})
exports.getPacienteCitas = catchAsync(async (req, res, next) => {
    //Salir una lista de citas de un solo paciente
})
exports.getOnePacienteCita = catchAsync(async (req, res, next) => {
    //Salir una cita de un solo paciente con su sesion incluida
}) 