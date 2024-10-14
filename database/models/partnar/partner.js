module.exports = (sequelize , Sequelize) =>{
    const partner = sequelize.define("partner",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        userID: {
            type : Sequelize.INTEGER
        },
        partnerMobileNumber : {
            type : Sequelize.BIGINT,
        },
        partnerName: {
            type : Sequelize.STRING
        }
    })
    // register.beforCreate(admin=>)
    partner.sync()
    .then(()=> console.log('Partner Table Created successfully'))
    .catch(err=>console.log('Did you wrong Partner table in database credentials?'+err));
    return partner
}