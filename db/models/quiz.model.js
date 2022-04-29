module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    'Quiz',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'user_title_unique',
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      numQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        refernces: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
        required: true,
        unique: 'user_title_unique',
      },
    },
    {
      uniqueKeys: {
        user_title_unique: {
          fields: ['title', 'userId'],
        },
      },
    }
  );

  return Quiz;
};
