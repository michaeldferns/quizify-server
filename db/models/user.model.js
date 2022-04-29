const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        async beforeCreate(instance, _options) {
          const hashedPassword = await bcrypt.hash(instance.password, 10);
          instance.password = hashedPassword;
        },
      },
    }
  );

  User.prototype.isValidPassword = async function (password) {
    const compare = await bcrypt.compare(password, this.password);

    return compare;
  };

  return User;
};
