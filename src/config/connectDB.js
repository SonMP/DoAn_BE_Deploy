const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('quanlylichkham', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "+07:00",
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: "+07:00"
    },
    logging: false
})

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.query("SET GLOBAL max_allowed_packet=67108864");
        console.log('Connection DB has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;