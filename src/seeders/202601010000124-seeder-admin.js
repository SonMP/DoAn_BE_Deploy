'use strict';
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let hashPasswordFromBcrypt = await bcrypt.hashSync("123456", salt);
    return queryInterface.bulkInsert('NguoiDung', [
      {
        email: 'admin@gmail.com',
        matKhau: hashPasswordFromBcrypt,
        ten: 'son',
        ho: 'admin',
        hinhanh: '',
        diaChi: '181/3',
        soDienThoai: '0987654321',
        gioiTinh: 'M',
        maVaiTro: 'R1',
        maViTri: 'P0',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {

  }
};
