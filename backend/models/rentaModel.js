const mongoose = require('mongoose');

// CitasDePacientes
// idPaciente | idCita
// ------------------------
// 31kh1h34kj | kj3njjfon4
// 31kh1h34kj | kll34kkjm1
// j4nknkjn2l | asasg99889

const rentaSchema = new mongoose.Schema({
    // precio de todas las citas

    // 1. listado de todas las citas (el coste de todas las citas)
    // 2. listado de todos los pacientes que hayan tenido alguna cita
    // 3. el id del psicologo de cuyos pacientes sacar la renta

    // un campo para contener todos los pacientes
    // otro campo para contener todas las citas de cada paciente
    // un total

    //
    idPaciente: {
        type: mongoose.Schema.ObjectId,
        ref: 'paciente',
        value: [mongoose.Schema.ObjectId],
        required: true,
    },
    costeTotal: {
        type: Number,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true,
    },
    fechaFin: {
        type: Date,
        required: true,
    }
    //No se que poner
});

const renta = mongoose.model('renta', rentaSchema);

module.exports = renta;