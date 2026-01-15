require('dotenv').config();

module.exports = {
    development: {
        username: "root",
        password: null,
        database: "quanlylichkham",
        host: "127.0.0.1",
        dialect: "mysql",
        logging: false,
        query: {
            raw: true
        },
        timezone: "+07:00",
        dialectOptions: {
            timezone: "+07:00",
            dateStrings: true,
            typeCast: true
        }
    },

    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql"
    },

    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
        query: {
            raw: true
        },
        timezone: "+07:00",
        dialectOptions: {
            timezone: "+07:00",
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};