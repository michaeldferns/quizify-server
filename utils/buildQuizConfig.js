// const { Question, Response } = require('../db');

const getSubset = (arr, num) => {
  let shuffled = arr.slice(0);
  let i = arr.length;
  let temp = null;
  let index = 0;

  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(0, num);
};

const buildQuizConfig = (quiz, allQuestions) => {
  const config = {
    userId: quiz.userId,
    quizId: quiz.id,
    time: quiz.time,
    complete: false,
    questions: null,
  };

  const questions = getSubset(allQuestions, quiz.numQuestions).map(
    (question) => {
      const questionConfig = {
        text: question.text,
        questionId: question.id,
        correctResponseId: null,
        selectedResponseId: null,
        responses: [],
      };

      for (const response of question.Responses) {
        if (response.correct) {
          questionConfig.correctResponseId = response.id;
        }

        questionConfig.responses.push({
          responseId: response.id,
          text: response.text,
          correct: response.correct,
        });
      }

      return questionConfig;
    }
  );

  config.questions = questions;

  return config;
};

module.exports = buildQuizConfig;
