const cors = require('cors');
const express = require('express');
const routes = require('./routes');
require('./services/passport');

const app = express();

// Apply Middlewares
app.use(express.json());
app.use(cors());

app.use(routes);

const PORT = process.env.PORT || 8081;

console.log(process.env.NODE_ENV);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
});
