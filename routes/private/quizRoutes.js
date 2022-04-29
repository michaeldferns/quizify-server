const { Router } = require('express');
const multer = require('multer');
const quizController = require('../../controllers/quizController');

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('', upload.single('config'), quizController.createQuiz);

router.get('', quizController.getQuizzes);

router.get('/:id', quizController.getQuiz);

module.exports = router;
