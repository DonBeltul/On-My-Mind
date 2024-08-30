const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    
    idPaciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paciente',
        unique: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    }
});

const cita = mongoose.model('cita', citaSchema);

module.exports = cita;