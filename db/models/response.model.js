module.exports = (sequelize, DataTypes) => {
  const Response = sequelize.define('Response', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    correct: {
      type: DataTypes.BOOLEAN,
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
  });

  return Response;
};
