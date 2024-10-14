module.exports = (sequelize , Sequelize) =>{
    const district = sequelize.define("district",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        districtName: {
            type : Sequelize.STRING
        },
        zoneName:{
            type : Sequelize.STRING,
        },
        isActive : {
            type : Sequelize.BOOLEAN
        }
    })
    district.sync()
    .then(()=> console.log('District Table Created successfully'))
    .catch(err=>console.log('Did you wrong District table in database credentials?'+err));
    return district
}