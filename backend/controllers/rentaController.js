const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Renta = require('./../models/rentaModel');
const Cita = require('./../models/citaModel');
const Paciente = require('./../models/pacienteModel');
const Usuario = require('./../models/usuarioModel');

//Una renta es un documento que incluye la lista de pacientes (sin el telefono), 
//cada uno con las citas que ha tenido y el coste de cada cita, durante una fecha determinada. 
//En la cabecera del documento aparecera el nombre y apellidos del usuario, su numero de colegiado
//y su dni.
//Al final del documento, después de la lista de pacientes, aparecerá la fecha de inicio
// y la fecha de fin (escogidas por el usuario). 
//Junto a esto aparecerá el coste total (que serán los ingresos del usuario)
// y sus gastos (que se restarán de los ingresos anteriores).
//Como último dato aparecera el ingreso total(la operación antes mencionada)

exports.getAllRenta = catchAsync(async(req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    const feautures = new APIFeatures(Renta.find({idUsuario : usuario._id}), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const rentas = await feautures.query;

    if(!rentas) {
        return next(new AppError('No hay rentas', 404));
    }

    res.status(200).json({
        status: 'success',
        results: rentas.length,
        data: {
            rentas
        }
    })
})

exports.getRenta = catchAsync( async (req, res) =>{
//Sacar la renta ,si hay creada si no crear una nueva, filtrada por fechas
const fechaInicio = new Date(req.params.fechaInicio);
const fechaFin = new Date(req.params.fechaFin);
const usuario = await Usuario.findById(req.params.id);
const renta = await Renta.find({
    idUsuario: usuario._id,
    fechaInicial: fechaInicio,
    fechaFinal: fechaFin
})
if(!renta) {
    return next(new AppError('No hay renta con ese ID o dentro de esas fechas', 404));
}
res.status(200).json({
    status: 'success',
    data: {
        renta
    }
})

})
exports.createRenta = catchAsync( async (req, res) =>{
//Crear la renta, filtrada por fechas
const fechaInicio = new Date(req.params.fechaInicio);
const fechaFin = new Date(req.params.fechaFin);
const usuario = await Usuario.findById(req.params.id);
const costeRenta = 0;
const pacientesRenta = []

const pacientes = await Paciente.find({
    idUsuario : usuario._id
})
for(let paciente of pacientes) {
    const citas = await Cita.find({
        idPaciente: paciente._id
    })
    const citasPaciente = []
    for(let cita of citas) {
        if((cita.fecha >= fechaInicio && cita.fecha <= fechaFin)) {
            costeRenta += cita.coste;
            citasPaciente.push(cita);
        }
    }
    let customPaciente = {
        idPaciente : paciente._id,
        nombre: paciente.nombre,
        citas: citasPaciente
    }
    pacientesRenta.push(customPaciente);
}
const newRenta = await Renta.create({
    idUsuario: usuario._id,
    nombreUsuario: usuario.nombre,
    dniUsuario: usuario.dni,
    numColegiadoUsuario: usuario.numColegiado,
    datosPacientes: pacientesRenta,
    costeTotal: costeRenta,
    fechaInicial: fechaInicio,
    fechaFinal: fechaFin,
})

res.status(201).json({
    status: 'success',
    data: {
        renta: newRenta
    }
})

})

exports.modificarRenta = catchAsync( async (req, res) =>{
//Modificar una renta ya creada
const renta = await Renta.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

if(!renta) {
    return next(new AppError('No hay renta con ese ID', 404));
}
res.status(200).json({
    status: 'success',
    data: {
        renta
    }
  });
})

exports.eliminarRenta = catchAsync( async (req, res) =>{
//Eliminar la renta hecha
const renta = await Renta.findByIdAndDelete(req.params.id);

if(!renta) {
    return next(new AppError('No hay renta con ese ID', 404));
}
res.status(204).json({
    status: 'success',
    data: null
  });
})
