const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect,authController.updatePassword);
router.patch('/updateMe', authController.protect, usuarioController.updateMe);
router.delete('/deleteMe', authController.protect, usuarioController.updateMe);
router
  .route('/')
  .get(usuarioController.getAllUsers)
  .post(usuarioController.createUser);

router
  .route('/:id')
  .get(usuarioController.getUser)
  .patch(usuarioController.updateUser)
  .delete(usuarioController.deleteUser);

module.exports = router;
