const express = require('express');
const rentaController = require('../controllers/rentaController');

const router = express.Router();

router
    .route('/:id')
    .get(rentaController.getAllRenta)

router
    .route('/:id/:fechaInicio/:fechaFin')
    .get(rentaController.getRenta)
    .post(rentaController.createRenta)
router
    .route('/modificar/:id')
    .patch(rentaController.modificarRenta);
router
    .route('/eliminar/:id')
    .delete(rentaController.eliminarRenta);

module.exports = router