if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const db = require('./db');
require('./services/passport');

// Create Express App
const app = express();

// Setup Middlewares
app.use(express.json());
app.use(cors());

// Setup Routes
app.use(routes);

const PORT = process.env.PORT || 3001;

db.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
});
