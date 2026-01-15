'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NguoiDung extends Model {
    static associate(models) {
      NguoiDung.belongsTo(models.QuyDinh, { foreignKey: 'gioiTinh', targetKey: 'khoa', as: 'duLieuGioiTinh' })
      NguoiDung.belongsTo(models.QuyDinh, { foreignKey: 'maViTri', targetKey: 'khoa', as: 'duLieuViTri' })
      NguoiDung.belongsTo(models.QuyDinh, { foreignKey: 'maVaiTro', targetKey: 'khoa', as: 'duLieuVaiTro' })

      NguoiDung.hasOne(models.ThongTinBacSi, { foreignKey: 'maBacSi', as: 'thongTinChiTiet' });

      NguoiDung.hasMany(models.LichTrinh, { foreignKey: 'maBacSi', as: 'lichTrinhBacSi' });

      NguoiDung.hasMany(models.DatLich, { foreignKey: 'maBacSi', as: 'lichHenBacSi' });
    }
  }
  NguoiDung.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    matKhau: DataTypes.STRING,
    ho: DataTypes.STRING,
    ten: DataTypes.STRING,
    hinhAnh: DataTypes.TEXT('long'),
    diaChi: DataTypes.STRING,
    soDienThoai: DataTypes.STRING,
    gioiTinh: DataTypes.STRING,
    maVaiTro: DataTypes.STRING,
    maViTri: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NguoiDung',
    tableName: 'NguoiDung',
    freezeTableName: true
  });
  return NguoiDung;
};