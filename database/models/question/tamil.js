module.exports = (sequelize , Sequelize) =>{
    const tamil = sequelize.define("tamil",{
        // const question = sequelize.define("testquestion",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        type: {
            type : Sequelize.STRING
        },
        question : {
            type : Sequelize.STRING(10000),
        },
        optionA: {
            type : Sequelize.STRING
        },
        optionB: {
            type : Sequelize.STRING
        },
        optionC: {
            type : Sequelize.STRING
        },
        optionD: {
            type : Sequelize.STRING
        },
        category:{
            type : Sequelize.STRING
        },
        answer: {
            type : Sequelize.STRING
        }
    })
    // register.beforCreate(admin=>)
    tamil.sync()
    .then(()=> console.log('tamil Table Created successfully'))
    .catch(err=>console.log('Did you wrong tamil table in database credentials?'+err));
    return tamil
}