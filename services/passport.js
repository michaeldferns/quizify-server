const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../db');

passport.use(
  'signup',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.create({ email, password });

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          const error = new Error('User does not exist.');
          error.name = 'UserDoesNotExist';

          return done(error);
        }

        const validPassword = await user.isValidPassword(password);

        if (!validPassword) {
          const error = new Error('Invalid password.');
          error.name = 'InvalidPassword';

          return done(error);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.jwtSecret || 'secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      const id = token?.user?.id;

      if (!id) {
        const error = new Error('Invalid token.');
        error.name = 'InvalidToken';
        return done(error);
      }

      try {
        const user = await User.findOne({
          where: {
            id,
          },
        });

        if (!user) {
          const error = new Error('Invalid token.');
          error.name = 'InvalidToken';
          return done(error);
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
