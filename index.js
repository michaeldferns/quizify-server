const express = require('express');

const app = express();

app.use((req, res) => {
  return res.json({
    message: 'server working',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
});