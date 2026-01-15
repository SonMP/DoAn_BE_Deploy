'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('LichTrinh', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            soLuongHienTai: {
                type: Sequelize.INTEGER
            },
            soLuongToiDa: {
                type: Sequelize.INTEGER
            },
            ngayHen: {
                type: Sequelize.DATE
            },
            khungThoiGian: {
                type: Sequelize.STRING,
                references: {
                    model: 'QuyDinh',
                    key: 'khoa'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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
        await queryInterface.dropTable('LichTrinh');
    }
};