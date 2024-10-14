const {v4: uuidv4} = require('uuid');

module.exports = (sequelize , Sequelize) =>{
    const scoreboard = sequelize.define("scoreboard",{
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
        
        ageGroup:{
            type : Sequelize.STRING
        },
        teamA: {
            type : Sequelize.STRING
        },
        teamB: {
            type : Sequelize.STRING
        },
        teamC: {
            type : Sequelize.STRING
        },
        teamD: {
            type : Sequelize.STRING
        }
        
    })

    scoreboard.sync()
    .then(()=> console.log('scoreboard Table Created successfully'))
    .catch(err=>console.log('Did you wrong scoreboard table in database credentials?'+err));
    return scoreboard
}