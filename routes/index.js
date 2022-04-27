const { Router } = require('express');

// Setup root router
const router = Router();

router.use((req, res) => {
  return res.status(404).json({
    message: '404',
  });
});

module.exports = router;
