const {v4: uuidv4} = require('uuid');

module.exports = (sequelize , Sequelize) =>{
    const zonalquestions = sequelize.define("zonalquestions",{
  
        id : {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        ZoneNo:{
            type : Sequelize.STRING
        },
        AgeGroup:{
            type : Sequelize.STRING
        },
        RoundNumber:{
            type : Sequelize.STRING
        },
        Questions: {
            type : Sequelize.STRING(10000)
        },
        optionA: {
            type : Sequelize.TEXT('long')
        },
        optionB: {
            type : Sequelize.TEXT('long')
        },
        optionC: {
            type : Sequelize.TEXT('long')
        },
        optionD: {
            type : Sequelize.TEXT('long')
        },
        Answer: {
            type : Sequelize.TEXT('long')
        },
        Category:{
            type : Sequelize.STRING
        },
        assetURL:{
            type : Sequelize.STRING
        },
        displayOrder:{
            type : Sequelize.STRING
        },
        
    })
    zonalquestions.sync()
    .then(()=> console.log('zonalquestions Table Created successfully'))
    .catch(err=>console.log('Did you wrong zonalquestions table in database credentials?'+err));
    return zonalquestions
}