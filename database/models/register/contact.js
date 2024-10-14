module.exports = (sequelize , Sequelize) =>{
    const Contact = sequelize.define("contact",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        phoneNumber: {
            type : Sequelize.STRING
        },
        name : {
            type : Sequelize.STRING
        },
        feedback : {
            type : Sequelize.STRING
        }
    })
    Contact.sync()
    .then(()=> console.log('contact Table Created successfully'))
    .catch(err=>console.log('Did you wrong contact table in database credentials?'+err));
    return Contact
}