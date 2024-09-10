const mongoose = require('mongoose');

const sesionSchema = new mongoose.Schema({
    idCita:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cita',
        unique: true
    },
    fecha: {
        type: Date,
        required: [true, 'Por favor dime la fecha']
    },
    anotaciones: {
        type:String,
        required: false
    }
    
});

const sesion = mongoose.model('sesion', sesionSchema);

module.exports = sesion;