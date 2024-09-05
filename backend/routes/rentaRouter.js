const express = require('express');
const rentaController = require('../controllers/rentaController');

const router = express.Router();

router
    .route('/:date/:date')//Falta incluir los datos de las fechas
    .get(rentaController.getRenta)
    .post(rentaController.createRenta)
router
    .route('/modificar/:id')
    .patch(rentaController.modificarRenta);
router
    .route('/eliminar/:id')
    .delete(rentaController.eliminarRenta);

module.exports = router