const { Sequelize } = require('sequelize');
require('dotenv').config();

const configurations = require('./config');

const env = process.env.NODE_ENV || 'development';
const config = configurations[env];

let sequelize;

if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`>>> Kết nối Database thành công!`);
        console.log(`>>> Môi trường: [${env}]`);
        console.log(`>>> Host: ${config.host}`);
    } catch (error) {
        console.error('>>> Lỗi kết nối Database:', error);
        if (env === 'development') {
            console.log('Mẹo: Kiểm tra XAMPP/MySQL đã khởi động chưa?');
        }
    }
}

module.exports = connectDB;