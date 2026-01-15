'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('QuyDinh', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            loai: {
                type: Sequelize.STRING
            },
            khoa: {
                type: Sequelize.STRING,
                unique: true
            },
            giaTriEn: {
                type: Sequelize.STRING
            },
            giaTriVi: {
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
        await queryInterface.dropTable('QuyDinh');
    }
};