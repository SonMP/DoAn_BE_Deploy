const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

let sequelize;

if (env === 'production') {
    sequelize = new Sequelize(
        process.env.DB_DATABASE_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: false,
            query: { raw: true },
            timezone: "+07:00",
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
                dateStrings: true,
                typeCast: true,
                timezone: "+07:00"
            }
        }
    );
} else {
    sequelize = new Sequelize('quanlylichkham', 'root', null, {
        host: 'localhost',
        dialect: 'mysql',
        timezone: "+07:00",
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            timezone: "+07:00"
        },
        logging: false
    });
}

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Connection DB (${env}) has been established successfully.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;