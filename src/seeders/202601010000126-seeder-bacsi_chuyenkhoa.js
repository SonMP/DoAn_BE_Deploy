'use strict';

const chuyenKhoaData = require('../utils/bacsi_chuyenkhoa.json');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const dataWithTimestamp = chuyenKhoaData.map(item => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        return queryInterface.bulkInsert('BacSi_ChuyenKhoa', dataWithTimestamp);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('BacSi_ChuyenKhoa', null, {});
    }
};