const { Response } = require('../db');

const generateResponses = (questions, quizConfig, transaction) => {
  const presavedResponses = [];

  for (const question of questions) {
    const id = question.id;
    const text = question.text;

    for (const config of quizConfig) {
      // Skip rest of loop if text does not match
      if (config.text !== text) {
        continue;
      }

      // Config must match text at this point (question === responses)
      for (const response of config.responses) {
        const { text: responseText, correct } = response;

        presavedResponses.push(
          Response.create(
            {
              text: responseText,
              correct,
              questionId: id,
            },
            { transaction }
          )
        );
      }
    }
  }

  return presavedResponses;
};

module.exports = generateResponses;
