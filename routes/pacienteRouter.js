const express = require('express');
const pacienteController = require('../controllers/pacienteController');

const router = express.Router();

router
    .route('/')
    .get(pacienteController.getPacientes)
    .post(pacienteController.createPaciente);

router
    .route('/:id')
    .get(pacienteController.getPaciente)
    .patch(pacienteController.modificarPaciente)
    .delete(pacienteController.eliminarPaciente);

router
    .route('/:id/citas')
    .get(pacienteController.getPacienteCitas)

router.route('/:id/citas/:id')
    .get(pacienteController.getOnePacienteCita);

router
    .route('/citas')
    .get(pacienteController.getPacientesCitas);

module.exports = router;