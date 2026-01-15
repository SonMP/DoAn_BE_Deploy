'use strict';
const db = require('../models/index');
const axios = require('axios');
const sharp = require('sharp');
const chuyenKhoaData = require('../utils/chuyenkhoa.json');

const urlToBase64 = async (url) => {
    try {
        let response = await axios.get(url, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(response.data);
        let resizedBuffer = await sharp(buffer)
            .resize(800, 500, { fit: 'inside' })
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toBuffer();
        return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
    } catch (e) {
        console.log("Lỗi tải ảnh: " + url);
        console.log(e);
        return "";
    }
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log(">>> BẮT ĐẦU SEED CHUYÊN KHOA (Convert ảnh sang Base64)...");

        let finalData = [];

        for (let i = 0; i < chuyenKhoaData.length; i++) {
            let item = chuyenKhoaData[i];

            console.log(`Đang xử lý: ${item.ten}...`);

            let base64Image = "";
            if (item.hinhAnh) {
                base64Image = await urlToBase64(item.hinhAnh);
            }

            finalData.push({
                ten: item.ten,
                moTa: item.moTa,
                hinhAnh: base64Image,
                noiDungHTML: item.noiDungHTML,
                noiDungMarkdown: item.noiDungMarkdown,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (finalData.length > 0) {
            return queryInterface.bulkInsert('ChuyenKhoa', finalData);
        }
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('ChuyenKhoa', null, {});
    }
};