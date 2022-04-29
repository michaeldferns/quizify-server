const { Router } = require('express');
const publicRoutes = require('./public');
const privateRoutes = require('./private');

const router = Router();

router.use(publicRoutes);
router.use(privateRoutes);

router.use((req, res) => {
  res.status(404).send('404');
});

module.exports = router;
