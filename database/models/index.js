// 'use strict';

// const path = require('path');
// const Sequelize = require('sequelize');

// // const env = process.env.NODE_ENV || 'development';
// // const config = require('./../../config/helper')
// const config = require('../../config/helpers');
// const db = {};

// // Database Connection

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.db, config.user, config.passwd, config);
// }
// // sequelize = new Sequelize(config.database.db, config.database.user, config.database.passwd, config.database.host, config.database.dialect, config)

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;


// // Models file import

// db.admin = require('../models/admin/admin')(sequelize , Sequelize);

// module.exports = db

const config = require("../../config/helpers");
//console.log(env);
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: config.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

sequelize.authenticate().then(() => {
  console.log('Connection established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

const db = {};
//https://sequelize.org/v5/manual/data-types.html
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require('../models/admin/admin')(sequelize, Sequelize);
db.register = require('../models/register/register')(sequelize, Sequelize);
db.score = require('../models/score/scoreSummary')(sequelize, Sequelize);
db.question = require('../models/question/question')(sequelize, Sequelize);
db.partner = require('../models/partnar/partner')(sequelize, Sequelize);
db.answer = require('../models/question/answer')(sequelize, Sequelize);
db.district = require('../models/register/districts ')(sequelize, Sequelize);
db.modelQuestion = require('../models/question/modelQuestion')(sequelize, Sequelize);
db.tamil = require('../models/question/tamil')(sequelize, Sequelize);
db.english = require('../models/question/english')(sequelize, Sequelize);
db.image = require('../models/question/image')(sequelize, Sequelize)
db.visitorCount = require('../models/register/visitor')(sequelize, Sequelize);
db.preregister = require('../models/preregister/preregister')(sequelize, Sequelize);
db.contact = require('../models/register/contact')(sequelize, Sequelize);
// db.register.hasMany(db.score, { foreignKey: "userID" , as: "scoreSummaries" });
// db.score.belongsTo(db.register, { foreignKey: "id",sourceKey: 'id', as: "register" });


db.zonalquestion = require('../models/zonal/questions/zonalquestions')(sequelize, Sequelize);
db.eventquestion = require('../models/zonal/event/eventquestions')(sequelize, Sequelize);
db.event = require('../models/zonal/event/event')(sequelize, Sequelize);
db.scoreboard = require('../models/zonal/scoreboard/scoreboard')(sequelize, Sequelize);


db.register.hasMany(db.score, {
  foreignKey: {
    name: 'userID',
    allowNull: false
  }, as: "scoreSummaries",
  foreignKeyConstraint: true
});

// db.score.belongsTo(db.register, { foreignKey: "id", sourceKey: 'id', as: "register" });
module.exports = db; 