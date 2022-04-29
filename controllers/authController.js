const passport = require('passport');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  passport.authenticate('signup', (err) => {
    if (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'A user with the provided email already exists.',
        });
      }

      return res.status(500).json({
        message: 'Internal server error.',
      });
    }

    return res.status(201).json({ message: 'User created successfully.' });
  })(req, res, next);
};

const login = async (req, res, next) => {
  passport.authenticate('login', (err, user) => {
    if (err) {
      if (err.name === 'UserDoesNotExist') {
        return res.status(400).json({
          message: 'A user does not exist with the provided email.',
        });
      } else if (err.name === 'InvalidPassword') {
        return res.status(400).json({
          message: 'Invalid password.',
        });
      } else {
        return res.status(500).json({
          message: 'Internal server error.',
        });
      }
    }

    const body = { id: user.id, email: user.email };
    const secret = process.env.jwtSecret || 'secret';
    const token = jwt.sign({ user: body }, secret);

    return res.json({ token });
  })(req, res, next);
};

module.exports = {
  login,
  signup,
};
