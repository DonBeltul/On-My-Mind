const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor dime tu nombre']
  },
  apellidos: {
    type: String,
    required: [true, 'Por favor dime tus apellidos']
  },
  email: {
    type: String,
    required: [true, 'Por favor dime tu email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Da un email valido']
  },
  dni:{
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
  numColegiado: {
    type: String,
    required: [true, 'Por favor dime tu numero de colegiado'],
    unique: true,
  },
  telefono: {
    type: Number,
    required: [true, 'Por favor dime tu numero de colegiado'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  password: {
    type: String,
    required: [true, 'Por favor dime tu contraseña'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Por favor confirma tu contraseña'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Las contraseñas no coinciden'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean, 
    default: true,
    select:false
  }
});

//MIDDLEWARE

usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

usuarioSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

usuarioSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

usuarioSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

usuarioSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const usuario = mongoose.model('usuario', usuarioSchema);

module.exports = usuario;
