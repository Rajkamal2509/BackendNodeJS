const {v4: uuidv4} = require('uuid');

module.exports = (sequelize , Sequelize) =>{
    const eventquestion = sequelize.define("eventquestion",{
        id : {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        eventId: {
            type : Sequelize.STRING
        },
        roundNumber: {
            type : Sequelize.STRING
        },
        questionId: {
            type : Sequelize.STRING
        },
        user: {
            type : Sequelize.STRING
        }
        
    })

    eventquestion.sync()
    .then(()=> console.log('eventquestion Table Created successfully'))
    .catch(err=>console.log('Did you wrong eventquestion table in database credentials?'+err));
    return eventquestion
}