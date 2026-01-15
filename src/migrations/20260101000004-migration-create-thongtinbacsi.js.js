'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ThongTinBacSi', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            maBacSi: {
                allowNull: false,
                type: Sequelize.INTEGER,
                unique: true,
                references: {
                    model: 'NguoiDung',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            donGia: {
                allowNull: false,
                type: Sequelize.DECIMAL,
            },
            moTa: {
                type: Sequelize.TEXT,
            },
            soLanKham: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            noiDungHTML: {
                allowNull: false,
                type: Sequelize.TEXT('long'),
            },
            noiDungMarkdown: {
                allowNull: false,
                type: Sequelize.TEXT('long'),
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
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ThongTinBacSi');
    }
};