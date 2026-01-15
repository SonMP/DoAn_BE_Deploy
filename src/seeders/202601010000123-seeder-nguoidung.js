'use strict';
const db = require('../models/index');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const doctorsData = require('../utils/bacsi.json');

const salt = bcrypt.genSaltSync(10);

const positionMap = {
    "BS": "P0", "BSCKI": "P0", "ThS.BS": "P1",
    "TS.BS": "P2", "PGS.TS": "P3", "GS.TS": "P4"
};

const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
};

const urlToBase64 = async (url) => {
    try {
        let response = await axios.get(url, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(response.data);
        let resizedBuffer = await sharp(buffer)
            .resize(800, 800, { fit: 'inside' })
            .toFormat('jpeg')
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .jpeg({ quality: 80 })
            .toBuffer();
        return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
    } catch (e) {
        console.log("Lỗi ảnh: " + url);
        return "";
    }
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log(">>> BẮT ĐẦU SEED BÁC SĨ...");
        let hashPasswordFromBcrypt = await bcrypt.hashSync("123456", salt);

        for (let i = 0; i < doctorsData.length; i++) {
            let item = doctorsData[i];
            let emailGen = removeVietnameseTones(item.ten + item.ho).toLowerCase().replace(/\s/g, '') + i + "@binhdan.com";

            let check = await db.NguoiDung.findOne({ where: { email: emailGen } });
            if (check) {
                console.log(`Bỏ qua: ${item.ho} ${item.ten} (Đã tồn tại)`);
                continue;
            }

            let base64Image = await urlToBase64(item.anh);

            await db.NguoiDung.create({
                email: emailGen,
                matKhau: hashPasswordFromBcrypt,
                ten: item.ten,
                ho: item.ho,
                diaChi: "Bệnh viện Bình Dân Đà Nẵng",
                soDienThoai: "0123456789",
                gioiTinh: "M",
                maVaiTro: "R2",
                maViTri: positionMap[item.viTri] || "P0",
                hinhAnh: base64Image,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`---> Đã thêm: ${item.ho} ${item.ten}`);
        }
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('NguoiDungs', { maVaiTro: 'R2' }, {});
    }
};