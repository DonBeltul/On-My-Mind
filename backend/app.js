const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const usuarioRouter = require('./routes/usuarioRouter');
const sesionesRouter = require('./routes/sesionRouter');
const pacientesRouter = require('./routes/pacienteRouter');
const citasRouter = require('./routes/citaRouter');
const rentaRouter = require('./routes/rentaRouter');

const app = express();

// 1) MIDDLEWARES 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/usuarios', usuarioRouter);
app.use('/api/v1/sesiones', sesionesRouter);
app.use('/api/v1/pacientes', pacientesRouter);
app.use('/api/v1/citas', citasRouter);
app.use('/api/v1/renta', rentaRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
