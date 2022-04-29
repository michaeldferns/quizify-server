module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        unique: 'question_quiz_unique',
      },
      quizId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Quizzes',
          key: 'id',
        },
        allowNull: false,
        required: true,
        unique: 'question_quiz_unique',
      },
    },
    {
      uniqueKeys: {
        question_quiz_unique: {
          fields: ['text', 'quizId'],
        },
      },
    }
  );

  return Question;
};
