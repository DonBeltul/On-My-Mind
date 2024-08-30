const mongoose = require('mongoose');


const pacienteSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: [true, 'Por favor dime tu nombre']
    },
    apellidos: {
        type: String,
        required: [true, 'Por favor dime tus apellidos']
    },
    dni: {
        type: String,
        required: [true, 'Por favor dime tu dni'],
        unique: true,
        validate: {
            validator: function(valor){
                var dniRexp = /^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i
                // var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
                // var nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
                return dniRexp.test(valor)
            },
            mensaje: 'El dni no es valido'
        }
    },
    telefono: {
        type:String,
        required: true
    },
});
const paciente = mongoose.model('paciente', pacienteSchema);

module.exports = paciente;