const { Router } = require('express');
const quizController = require('../../controllers/quizController');

const router = Router();

router.get('', quizController.getAttempts);

router.get('/:quizId', quizController.attemptQuiz);

router.patch(
  '/:attemptId/response/:responseId',
  quizController.updateAttemptResponse
);

router.patch('/:id', quizController.updateAttempt);

module.exports = router;
