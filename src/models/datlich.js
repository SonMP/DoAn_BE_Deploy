'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DatLich extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            DatLich.belongsTo(models.NguoiDung, { foreignKey: 'maBenhNhan', targetKey: 'id', as: 'thongTinBenhNhan' });
            DatLich.belongsTo(models.NguoiDung, { foreignKey: 'maBacSi', targetKey: 'id', as: 'thongTinBacSi' });

            DatLich.belongsTo(models.QuyDinh, { foreignKey: 'maTrangThai', targetKey: 'khoa', as: 'trangThaiData' });
            DatLich.belongsTo(models.QuyDinh, { foreignKey: 'khungThoiGian', targetKey: 'khoa', as: 'thoiGianData' });
        }
    }
    DatLich.init({
        maTrangThai: DataTypes.STRING,
        maBacSi: DataTypes.INTEGER,
        maBenhNhan: DataTypes.INTEGER,
        ngayHen: DataTypes.DATE,
        khungThoiGian: DataTypes.STRING,
        lyDo: DataTypes.TEXT,
        token: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'DatLich',
        tableName: 'DatLich',
        freezeTableName: true
    });
    return DatLich;
};