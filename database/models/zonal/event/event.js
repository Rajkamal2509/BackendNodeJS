const {v4: uuidv4} = require('uuid');

module.exports = (sequelize , Sequelize) =>{
    const event = sequelize.define("event",{
        id : {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        zone: {
            type : Sequelize.STRING
        },
        district: {
            type : Sequelize.STRING
        },
        date: {
            type : Sequelize.STRING
        },
        user: {
            type : Sequelize.STRING
        }
        
    })

    event.sync()
    .then(()=> console.log('event Table Created successfully'))
    .catch(err=>console.log('Did you wrong event table in database credentials?'+err));
    return event
}