'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ChuyenKhoa', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ten: {
                type: Sequelize.STRING
            },
            moTa: {
                type: Sequelize.TEXT
            },
            hinhAnh: {
                type: Sequelize.TEXT('long')
            },
            noiDungHtml: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            noiDungMarkdown: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ChuyenKhoa');
    }
};