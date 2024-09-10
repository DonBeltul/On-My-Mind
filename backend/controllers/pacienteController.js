const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Paciente = require('../models/pacienteModel');
const Cita = require('./../models/citaModel');
const Sesion = require('./../models/sesionModel');



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
    const estadisticas = [];
    const feautures = new APIFeatures(Paciente.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const pacientes = await feautures.query;
    for(let paciente of pacientes) {
      const citasPaciente = await Cita.find({
        idPaciente: paciente._id
      })

      let customPaciente = {
        Id : paciente._id,
        nombre: paciente.nombre,
        apellidos: paciente.apellidos,
        dni: paciente.dni,
        telefono: paciente.telefono,
        citas: citasPaciente
      }
      estadisticas.push(customPaciente);
    }

    res.status(200).json({
      status: 'success',
      data: {
        estadisticas
      }
    })

})
exports.getPacienteCitas = catchAsync(async (req, res, next) => {
    //Salir una lista de citas de un solo paciente
    const paciente = await Paciente.findById(req.params.id);
    
    if(!paciente){
      return next(new AppError('No hay paciente con ese ID', 404));
    }
    const citas = await Cita.find({
      idPaciente : paciente._id
    })
    if(!citas){
      return next(new AppError('Este paciente no tiene citas', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        paciente, citas
      }
    })
})
exports.getOnePacienteCita = catchAsync(async (req, res, next) => {
    //Salir una cita de un solo paciente con su sesion incluida
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
      return next(new AppError('No hay paciente con ese ID', 404));
    }
    const citas = await Cita.find({
      idPaciente : paciente._id
    })
    if(!citas){
      return next(new AppError('Este usuario no tiene citas', 404));
    }
    const citasSesiones = [];
    for(let cita of citas) {
      const sesionCita = await Sesion.find({
        idCita: cita._id
      })
      let customCita = {
        id: cita._id,
        fecha: cita.fecha,
        hora: cita.hora,
        sesion: sesionCita
      }
      citasSesiones.push(customCita);
    }
    res.status(200).json({
      status: 'success',
      data: {
        paciente,citasSesiones
      }
    })
}) 