const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//Una renta es un documento que incluye la lista de pacientes (sin el telefono), 
//cada uno con las citas que ha tenido y el coste de cada cita, durante una fecha determinada. 
//En la cabecera del documento aparecera el nombre y apellidos del usuario, su numero de colegiado
//y su dni.
//Al final del documento, después de la lista de pacientes, aparecerá la fecha de inicio
// y la fecha de fin (escogidas por el usuario). 
//Junto a esto aparecerá el coste total (que serán los ingresos del usuario)
// y sus gastos (que se restarán de los ingresos anteriores).
//Como último dato aparecera el ingreso total(la operación antes mencionada)

exports.getRenta = catchAsync( async (req, res) =>{
//Sacar la renta ,si hay creada si no crear una nueva, filtrada por fechas

})
exports.createRenta = catchAsync( async (req, res) =>{
//Crear la renta, filtrada por fechas
})

exports.modificarRenta = catchAsync( async (req, res) =>{
//Modificar una renta ya creada
})

exports.eliminarRenta = catchAsync( async (req, res) =>{
//Eliminar la renta hecha
})
