'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DatLich', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            maTrangThai: {
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
            maBenhNhan: {
                type: Sequelize.INTEGER,
                type: Sequelize.INTEGER,
                references: {
                    model: 'NguoiDung',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            ngayHen: {
                type: Sequelize.DATE
            },
            khungThoiGian: {
                type: Sequelize.STRING,
                type: Sequelize.STRING,
                references: {
                    model: 'QuyDinh',
                    key: 'khoa'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            lyDo: {
                type: Sequelize.TEXT
            },
            token: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('DatLich');
    }
};