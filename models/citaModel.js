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
    },
    coste: {
        type:Number,
        default:50,
        max:80,
    }
});

const cita = mongoose.model('cita', citaSchema);

module.exports = cita;