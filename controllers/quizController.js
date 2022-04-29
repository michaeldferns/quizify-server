const validator = require('validator');
const parseQuizConfig = require('../utils/parseQuizConfig');
const generateResponses = require('../utils/generateResponses');
const buildQuizConfig = require('../utils/buildQuizConfig');
const updateConfig = require('../utils/updateConfig');
const {
  sequelize,
  Quiz,
  Question,
  Response,
  Attempt,
  AttemptResponse,
} = require('../db');

const createQuiz = async (req, res) => {
  // User from middleware
  const user = req.user;
  // File from form-data ('config') as Buffer
  const file = req.file?.buffer;
  // Parameters from body
  const title = req.body.title;
  const time = req.body.time || null;
  let numQuestions = req.body.numQuestions || null;

  // Handle missing file
  if (!file) {
    return res.status(400).json({
      message: 'Missing title parameter.',
    });
  }

  // Handle missing title
  if (!title) {
    return res.status(400).json({
      message: 'Missing title parameter.',
    });
  }

  // Start transaction
  const transaction = await sequelize.transaction();

  try {
    // Parse quiz config
    const quizConfig = parseQuizConfig(file);

    if (quizConfig.length === 0) {
      // Rollback
      await transaction.rollback();

      return res.status(400).json({
        message: 'The provided config contains zero questions.',
      });
    }

    // Set numQuestions to default of length
    if (!numQuestions || !validator.isInt(numQuestions)) {
      numQuestions = quizConfig.length;
    } else if (parseInt(numQuestions) <= 0) {
      numQuestions = quizConfig.length;
    }

    // Create Quiz
    const quiz = await Quiz.create(
      {
        title,
        time,
        numQuestions,
        userId: user.id,
      },
      { transaction }
    );

    // Create Questions
    const presavedQuestions = quizConfig.map((questionConfig) => {
      const { text } = questionConfig;

      return Question.create(
        {
          text,
          quizId: quiz.id,
        },
        { transaction }
      );
    });

    const questions = await Promise.all(presavedQuestions);

    // Create responses
    const presavedResponses = generateResponses(
      questions,
      quizConfig,
      transaction
    );

    await Promise.all(presavedResponses);

    // // Commit transaction
    await transaction.commit();

    return res.status(201).json({
      message: 'Quiz created successfully.',
    });
  } catch (err) {
    console.log(err);

    // Rollback
    await transaction.rollback();

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'The provided config or parameters are invalid.',
      });
    }

    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getQuizzes = async (req, res) => {
  const user = req.user;

  try {
    const quizzes = await Quiz.findAll({
      where: {
        userId: user.id,
      },
    });

    return res.json({
      quizzes,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const getQuiz = async (req, res) => {
  const user = req.user;
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findOne({
      where: {
        id: quizId,
        userId: user.id,
      },
    });

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found.',
      });
    }

    return res.json({
      quiz,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const attemptQuiz = async (req, res) => {
  const user = req.user;
  const quizId = req.params.quizId;

  const transaction = await sequelize.transaction();

  try {
    const quiz = await Quiz.findOne({
      where: {
        id: quizId,
        userId: user.id,
      },
    });

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found.',
      });
    }

    const questions = await Question.findAll({
      where: {
        quizId: quiz.id,
      },
      include: [
        {
          model: Response,
          required: true,
        },
      ],
    });

    let quizConfig = buildQuizConfig(quiz, questions);

    // Create attempt
    const attempt = await Attempt.create(
      {
        userId: user.id,
        quizId: quiz.id,
      },
      { transaction }
    );

    const presavedAttemptResponses = quizConfig.questions.map((question) => {
      return AttemptResponse.create(
        {
          attemptId: attempt.id,
          questionId: question.questionId,
          correctResponseId: question.correctResponseId,
          selectedResponseId: question.selectedResponseId,
        },
        { transaction }
      );
    });

    const attemptResponses = await Promise.all(presavedAttemptResponses);

    await transaction.commit();

    quizConfig = updateConfig(quizConfig, attempt, attemptResponses);

    return res.json({
      message: 'Attempt started.',
      quizConfig,
    });
  } catch (err) {
    await transaction.rollback();

    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const updateAttempt = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const attempt = await Attempt.findOne({
      where: {
        id,
      },
    });

    if (!attempt) {
      return res.status(404).json({
        message: 'Not found.',
      });
    }

    if (completed !== undefined) {
      attempt.completed = completed;

      await attempt.save();
    }

    return res.json({
      message: 'Attempt updated.',
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: 'Internal server error.',
      err,
    });
  }
};

const updateAttemptResponse = async (req, res) => {
  const { attemptId, responseId: id } = req.params;
  const { selectedResponseId } = req.body;

  try {
    const attemptResponse = await AttemptResponse.findOne({
      where: {
        id,
        attemptId,
      },
    });

    if (!attemptResponse) {
      return res.status(404).json({
        message: 'Not found.',
      });
    }

    if (selectedResponseId !== undefined) {
      attemptResponse.selectedResponseId = selectedResponseId;

      await attemptResponse.save();
    }

    return res.json({
      message: 'Attempt response updated.',
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const getAttempts = async (req, res) => {
  const user = req.user;

  try {
    const attempts = await Attempt.findAll({
      where: {
        userId: user.id,
        completed: true,
      },
      include: [
        {
          model: AttemptResponse,
          required: true,
        },
        {
          model: Quiz,
          required: true,
        },
      ],
    });

    return res.json({
      attempts,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  getAttempts,
  attemptQuiz,
  updateAttempt,
  updateAttemptResponse,
};
