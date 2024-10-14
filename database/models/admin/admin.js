module.exports = (sequelize , Sequelize) =>{
    const admin = sequelize.define("admin",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER,
        },
        adminName: {
            type : Sequelize.STRING
        },
        password : {
            type : Sequelize.STRING
        }
    })
    // admin.beforCreate(admin=>)
    admin.sync()
    .then(()=> console.log('Admin Table Created successfully'))
    .catch(err=>console.log('Did you wrong Admin table in database credentials?'+err));
    return admin
}