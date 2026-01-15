'use strict';

const dataQuyDinh = require('../utils/quydinh.json');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const dataWithTimestamp = dataQuyDinh.map(item => {
            return {
                ...item,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return queryInterface.bulkInsert('QuyDinh', dataWithTimestamp, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('QuyDinh', null, {});
    }
};