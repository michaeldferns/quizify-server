const updateConfig = (config, attempt, attemptResponses) => {
  config.attemptId = attempt.id;

  config.questions = config.questions.map((question) => {
    for (const attemptResponse of attemptResponses) {
      if (attemptResponse.questionId !== question.questionId) {
        continue;
      }

      question.attemptResponseId = attemptResponse.id;
    }

    return question;
  });

  return config;
};

module.exports = updateConfig;
