const express = require('express');
const sesionController = require('../controllers/sesionController');

const router = express.Router();

router
    .route('/')
    .get(sesionController.getSesiones)
    .post(sesionController.createSesion);

router
    .route('/:id')
    .get(sesionController.getSesion)
    .patch(sesionController.modificarSesion)
    .delete(sesionController.eliminarSesion);

module.exports = router