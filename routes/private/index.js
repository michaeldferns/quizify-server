const { Router } = require('express');
const quizRoutes = require('./quizRoutes');
const attemptRoutes = require('./attemptRoutes');
const jwtAuthMiddleware = require('../../middlewares/jwtAuthMiddleware');

const router = Router();

router.use(jwtAuthMiddleware);
router.use('/quiz', quizRoutes);
router.use('/attempt', attemptRoutes);

module.exports = router;
