module.exports = (sequelize , Sequelize) =>{
    const visitorCount = sequelize.define("visitorCount",{
        id : {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type : Sequelize.INTEGER
        },
        visitor: {
            type : Sequelize.STRING
        },
        count : {
            type : Sequelize.BIGINT
        }
    })
    visitorCount.sync()
    .then(()=> console.log('VisitorCount Table Created successfully'))
    .catch(err=>console.log('Did you wrong VisitorCount table in database credentials?'+err));
    return visitorCount
}