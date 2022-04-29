module.exports = (sequelize, DataTypes) => {
  const AttemptResponse = sequelize.define('AttemptResponse', {
    attemptId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Attempts',
        key: 'id',
      },
      allowNull: false,
      required: true,
    },
    questionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Questions',
        key: 'id',
      },
      allowNull: false,
      required: true,
    },
    correctResponseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Responses',
        key: 'id',
      },
      allowNull: false,
      required: true,
    },
    selectedResponseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Responses',
        key: 'id',
      },
      allowNull: true,
      required: true,
    },
  });

  return AttemptResponse;
};
