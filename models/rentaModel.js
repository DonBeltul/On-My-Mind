const mongoose = require('mongoose');

const rentaSchema = new mongoose.Schema({
    
    //No se que poner
});

const renta = mongoose.model('renta', rentaSchema);

module.exports = renta;