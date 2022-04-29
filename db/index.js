const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'production') {
  const { PG_USER, PG_PASSWORD, PG_DATABASE, PG_HOST, PG_PORT } = process.env;

  sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
    host: PG_HOST,
    port: PG_PORT,
    dialect: 'postgres',
    ssl: 'Amazon RDS',
    pool: { maxConnections: 5, maxIdleTime: 30 },
    language: 'en',
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
  });
}

const db = {
  Sequelize,
  sequelize,
  User: require('./models/user.model')(sequelize, Sequelize),
  Quiz: require('./models/quiz.model')(sequelize, Sequelize),
  Question: require('./models/question.model')(sequelize, Sequelize),
  Response: require('./models/response.model')(sequelize, Sequelize),
  Attempt: require('./models/attempt.model')(sequelize, Sequelize),
  AttemptResponse: require('./models/attempt-response.model')(
    sequelize,
    Sequelize
  ),
};

// Associations
db.User.hasMany(db.Quiz, {
  foreignKey: 'userId',
});

db.Quiz.hasMany(db.Question, {
  foreignKey: 'quizId',
});

db.Question.hasMany(db.Response, {
  foreignKey: 'questionId',
});

db.User.hasMany(db.Attempt, {
  foreignKey: 'userId',
});

db.Quiz.hasMany(db.Attempt, {
  foreignKey: 'quizId',
});

db.Attempt.belongsTo(db.Quiz, {
  foreignKey: 'quizId',
});

db.Attempt.hasMany(db.AttemptResponse, {
  foreignKey: 'attemptId',
});

db.Question.hasMany(db.AttemptResponse, {
  foreignKey: 'questionId',
});

db.Response.hasMany(db.AttemptResponse, {
  foreignKey: 'correctResponseId',
});

db.Response.hasMany(db.AttemptResponse, {
  foreignKey: 'selectedResponseId',
});

module.exports = db;
