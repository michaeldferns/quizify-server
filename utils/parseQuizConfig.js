const configRegex =
  /^@Q.*\n((?:(?:\s)|(?:\*.*?\s)|(?:.*?\s))+?)@A.*\n(\d+)\s((?:.*\s)+?)@E.*$/gm;

const parseQuizConfig = (buffer) => {
  const fileContents = buffer.toString('utf8');

  const matches = [...fileContents.matchAll(configRegex)].map((match) => {
    const answer = parseInt(match[2]);

    let text = '';
    for (let questionLine of match[1].split('\n')) {
      questionLine = questionLine.trim();

      if (questionLine !== '' && questionLine.charAt(0) !== '*') {
        if (text === '') {
          text += questionLine;
        } else {
          text += ` ${questionLine.replace(/\s{2,}/g, ' ')}`;
        }
      }
    }

    const responseTexts = [];
    for (let response of match[3].split('\n')) {
      response = response.trim();

      if (response.charAt(0) !== '*' && response !== '') {
        responseTexts.push(response.replace(/\s{2,}/g, ' '));
      }
    }

    const responses = [];
    for (const [index, text] of responseTexts.entries()) {
      responses.push({
        correct: answer === index + 1,
        text,
      });
    }

    return {
      text,
      answer,
      responses,
    };
  });

  return matches;
};

module.exports = parseQuizConfig;
