'use strict';
const doctorInforData = require('../utils/thongtinbacsi.json');
const db = require('../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let finalData = [];

        for (let doctor of doctorInforData) {
            let user = await db.NguoiDung.findOne({
                where: {
                    ho: doctor.ho,
                    ten: doctor.ten,
                    maVaiTro: 'R2'
                },
                raw: true
            });

            if (user) {
                finalData.push({
                    maBacSi: user.id,
                    donGia: doctor.donGia,
                    moTa: doctor.moTa,
                    soLanKham: doctor.soLanKham,
                    noiDungHTML: doctor.noiDungHTML,
                    noiDungMarkdown: doctor.noiDungMarkdown,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }

        if (finalData.length > 0) {
            return queryInterface.bulkInsert('ThongTinBacSi', finalData);
        }
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('ThongTinBacSi', null, {});
    }
};