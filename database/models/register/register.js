module.exports = (sequelize , Sequelize) =>{
    const register = sequelize.define("register",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER
        },
        name: {
            type : Sequelize.STRING
        },
        mobileNumber : {
            type : Sequelize.BIGINT,
            limit : 10
        },
        dob: {
            type : Sequelize.STRING
        },
        age : {
            type : Sequelize.INTEGER
        },
        gender: {
            type : Sequelize.STRING
        },
        district: {
            type : Sequelize.STRING
        },
        otp : {
            type : Sequelize.BIGINT
        }
    })

    // {
    //     timestamps: false,
    //     // tableName: 'register',
    //     freezeTableName: false,  // true: if we want to make table name as we want else sequelize will make them prural
    //     underscored: false // underscored: true indicates the the column names of the database tables are snake_case rather than camelCase
    // }

    // register.beforCreate(admin=>)
    // register.associate = function(models) {
    //     register.belongsTo(models.scoreSummary, {foreignKey: 'userID',targetKey: 'id'});

    // }
    register.sync()
    .then(()=> console.log('Register Table Created successfully'))
    .catch(err=>console.log('Did you wrong Register table in database credentials?'+err));
    return register
}