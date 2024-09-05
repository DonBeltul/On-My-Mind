const express = require('express');
const citaController = require('../controllers/citaController');

const router = express.Router();

router
    .route('/')
    .get(citaController.getCitas)
    .post(citaController.createCita);

router
    .route('/:id')
    .get(citaController.getCita)
    .patch(citaController.modificarCita)
    .delete(citaController.eliminarCita);

    module.exports = router;