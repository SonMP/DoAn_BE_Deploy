'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('LichSu', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            maBenhNhan: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'NguoiDung',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            maBacSi: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'NguoiDung',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            moTa: {
                type: Sequelize.TEXT
            },
            taiLieu: {
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('LichSu');
    }
};