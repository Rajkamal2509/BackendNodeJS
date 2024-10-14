module.exports = (sequelize , Sequelize) =>{
    const english = sequelize.define("english",{
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
    english.sync()
    .then(()=> console.log('english Table Created successfully'))
    .catch(err=>console.log('Did you wrong english table in database credentials?'+err));
    return english
}