'use strict';

const dataLichSu = require('../utils/lichsu.json');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const dataWithTimestamp = dataLichSu.map(item => {
            return {
                ...item,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return queryInterface.bulkInsert('LichSu', dataWithTimestamp, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('LichSu', null, {});
    }
};