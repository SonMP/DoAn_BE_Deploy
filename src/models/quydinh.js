'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuyDinh extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuyDinh.hasMany(models.NguoiDung, { foreignKey: 'maViTri', as: 'viTriData', sourceKey: 'khoa' });
      QuyDinh.hasMany(models.NguoiDung, { foreignKey: 'gioiTinh', as: 'gioiTinhData', sourceKey: 'khoa' });
      QuyDinh.hasMany(models.NguoiDung, { foreignKey: 'maVaiTro', as: 'vaiTroData', sourceKey: 'khoa' });

      QuyDinh.hasMany(models.LichTrinh, { foreignKey: 'khungThoiGian', as: 'thoiGianData', sourceKey: 'khoa' });

      QuyDinh.hasMany(models.DatLich, { foreignKey: 'maTrangThai', as: 'trangThaiData', sourceKey: 'khoa' });
      QuyDinh.hasMany(models.DatLich, { foreignKey: 'khungThoiGian', as: 'thoiGianDatLich', sourceKey: 'khoa' });
    }
  }
  QuyDinh.init({
    loai: DataTypes.STRING,
    khoa: {
      type: DataTypes.STRING,
      unique: true
    },
    giaTriEn: DataTypes.STRING,
    giaTriVi: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'QuyDinh',
    tableName: 'QuyDinh',
    freezeTableName: true
  });
  return QuyDinh;
};