module.exports = (sequelize , Sequelize) =>{
    const banner = sequelize.define("banner",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        type: {
            type : Sequelize.STRING
        },
        language: {
            type : Sequelize.STRING
        },
        device: {
            type : Sequelize.STRING
        },
        fileName : {
            type : Sequelize.STRING,
        },
        isActive : {
            type : Sequelize.BOOLEAN
        }
    })
    banner.sync()
    .then(()=> console.log('Banner Table Created successfully'))
    .catch(err=>console.log('Did you wrong Banner table in database credentials?'+err));
    return banner
}