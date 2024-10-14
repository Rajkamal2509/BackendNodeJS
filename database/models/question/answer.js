module.exports = (sequelize , Sequelize) =>{
    const answer = sequelize.define("saveQuiz",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        quizID: {
            type : Sequelize.INTEGER
        },
        userID : {
            type : Sequelize.INTEGER,
        },
        questionID: {
            type : Sequelize.INTEGER
        },
        questiontype: {
            type : Sequelize.STRING
        },
        selectedAnswer: {
            type : Sequelize.STRING
        },
        quizTime : {
            type : Sequelize.INTEGER
        },
        isScored: {
            type : Sequelize.BOOLEAN
        },
        score: {
            type : Sequelize.INTEGER
        }
    })
    // register.beforCreate(admin=>)
    answer.sync()
    .then(()=> console.log('Answer Table Created successfully'))
    .catch(err=>console.log('Did you wrong Answer table in database credentials?'+err));
    return answer
}