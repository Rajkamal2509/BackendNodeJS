module.exports = (sequelize , Sequelize) =>{
    const modelQuestion = sequelize.define("modelQuestion",{
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
            type : Sequelize.STRING,
            
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
    modelQuestion.sync()
    .then(()=> console.log('ModelQuestion Table Created successfully'))
    .catch(err=>console.log('Did you wrong ModelQuestion table in database credentials?'+err));
    return modelQuestion
}