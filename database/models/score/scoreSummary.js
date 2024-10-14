const REGISTER = require('../register/register')

module.exports = (sequelize , Sequelize) =>{
    const scoreSummary = sequelize.define("scoreSummary",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        userID: {
            allowNull: false,
            type : Sequelize.INTEGER,
            references: {
                // model: REGISTER,
                // key: 'id'
            }
        },
        mobileNumber : {
            type : Sequelize.BIGINT,
        },
        totalquestions: {
            type : Sequelize.BIGINT
        },
        score: {
            type : Sequelize.BIGINT,
        },
        date: {
            type : Sequelize.STRING
        },
        language: {
            type : Sequelize.STRING
        },
        questionCount : {
            type : Sequelize.INTEGER
        },
        isScored : {
            type : Sequelize.BOOLEAN
        }
    })

    // {
    //     timestamps: false,
    //     // tableName: 'scoreSummary',
    //     freezeTableName: false,  // true: if we want to make table name as we want else sequelize will make them prural
    //     underscored: false // underscored: true indicates the the column names of the database tables are snake_case rather than camelCase
    // }

    // register.beforCreate(admin=>)
    // scoreSummary.associate = function(models) {
    //     scoreSummary.hasMany(models.register, {foreignKey: 'id',sourceKey: 'id'});
    // }
    // register.beforCreate(admin=>)
    scoreSummary.sync()
    .then(()=> console.log('Score Table Created successfully'))
    .catch(err=>console.log('Did you wrong Score table in database credentials?'+err));
    return scoreSummary
}