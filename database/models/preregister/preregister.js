module.exports = (sequelize , Sequelize) =>{
    const preregister = sequelize.define("preregister",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER
        },
        mobileNumber : {
            type : Sequelize.BIGINT,
            limit : 10
        }
    })

    preregister.sync()
    .then(()=> console.log('Preregister Table Created successfully'))
    .catch(err=>console.log('Did you wrong Preregister table in database credentials?'+err));
    return preregister
}