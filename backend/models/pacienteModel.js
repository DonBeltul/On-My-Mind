const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        unique: true,
        required: true,
    },
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

//Hacer un middleware donde cuando hagas la funcion 'find', te salga un array de citas

const paciente = mongoose.model('paciente', pacienteSchema);


module.exports = paciente;