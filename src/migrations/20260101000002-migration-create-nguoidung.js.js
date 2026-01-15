'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NguoiDung', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      matKhau: {
        type: Sequelize.STRING
      },
      ho: {
        type: Sequelize.STRING
      },
      ten: {
        type: Sequelize.STRING
      },
      hinhAnh: {
        type: Sequelize.TEXT('long')
      },
      diaChi: {
        type: Sequelize.STRING
      },
      soDienThoai: {
        type: Sequelize.STRING
      },
      gioiTinh: {
        type: Sequelize.STRING,
        references: {
          model: 'QuyDinh',
          key: 'khoa'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      maVaiTro: {
        type: Sequelize.STRING,
        references: {
          model: 'QuyDinh',
          key: 'khoa'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      maViTri: {
        type: Sequelize.STRING,
        references: {
          model: 'QuyDinh',
          key: 'khoa'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('NguoiDung');
  }
};