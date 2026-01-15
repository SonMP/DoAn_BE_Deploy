'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('BacSi_ChuyenKhoa', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            maBacSi: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ThongTinBacSi',
                    key: 'maBacSi'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            maChuyenKhoa: {
                type: Sequelize.INTEGER,
                type: Sequelize.INTEGER,
                references: {
                    model: 'ChuyenKhoa',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
        await queryInterface.dropTable('BacSi_ChuyenKhoa');
    }
};