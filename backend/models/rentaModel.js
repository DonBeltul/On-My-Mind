const mongoose = require('mongoose');

const rentaSchema = new mongoose.Schema({
    // precio de todas las citas

    // 1. listado de todas las citas (el coste de todas las citas)
    // 2. listado de todos los pacientes que hayan tenido alguna cita
    // 3. el id del psicologo de cuyos pacientes sacar la renta

    // un campo para contener todos los pacientes
    // otro campo para contener todas las citas de cada paciente
    // un total

    //
    idUsuario : {
        type: mongoose.Schema.ObjectId,
        ref: 'usuario',
        value: [mongoose.Schema.ObjectId],
        required: true,
    },
    nombreUsuario: {
        type: String,
        required: true,
    },
    numColegiadoUsuario: {
        type: String,
        required: true,
    },
    dniUsuario: {
        type: String,
        required: true
    },
    datosPacientes : {
        type: Array, 
        default: [],
        required: true,
    },
    costeTotal: {
        type: Number,
        required: true
    },
    fechaInicial: {
        type: Date,
        required: true,
    },
    fechaFinal: {
        type: Date,
        required: true,
    }
});

const renta = mongoose.model('renta', rentaSchema);

module.exports = renta;