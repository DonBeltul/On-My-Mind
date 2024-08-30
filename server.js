const dotenv = require('dotenv');
const app = require('./app');
const connectDb = require('./database');

dotenv.config({ path: './config.env' });

connectDb();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
