const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectDb = async () => {
  console.log('process.env.DATABASE', process.env.DATABASE);
  try {
    await mongoose.connect(DB, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true // asi se recurre a la forma mas actualizada de analizar cadenas de conexion al servidor de BD
    });

    console.log('MongoDB Connected...');

    // Aquí sincronizo los índices de todos los modelos
    const models = Object.values(mongoose.models);
    for (const model of models) {
      await model.syncIndexes(); // esta operación puede ser costosa, es aconsejable realizarlo solo una vez, en el inicio de la aplicacion
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDb;
