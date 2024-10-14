module.exports = (sequelize , Sequelize) =>{
    const question = sequelize.define("question",{
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
        prompt : {
            type : Sequelize.STRING,
        },
        options: {
            type : Sequelize.JSON
        },
        answer: {
            type : Sequelize.STRING
        }
    })
    // register.beforCreate(admin=>)
    question.sync()
    .then(()=> console.log('Question Table Created successfully'))
    .catch(err=>console.log('Did you wrong Question table in database credentials?'+err));
    return question
}