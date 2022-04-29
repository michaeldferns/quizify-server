module.exports = (sequelize, DataTypes) => {
  const Attempt = sequelize.define('Attempt', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: false,
      required: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Quizzes',
        key: 'id',
      },
      allowNull: false,
      required: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      required: true,
      defaultValue: false,
    },
  });

  return Attempt;
};
