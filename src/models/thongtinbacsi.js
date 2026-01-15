'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ThongTinBacSi extends Model {
        static associate(models) {

            ThongTinBacSi.belongsTo(models.NguoiDung, { foreignKey: 'maBacSi', targetKey: 'id', as: 'thongTinNguoiDung' });

            ThongTinBacSi.belongsToMany(models.ChuyenKhoa, {
                through: models.BacSi_ChuyenKhoa,
                foreignKey: 'maBacSi',
                sourceKey: 'maBacSi',
                otherKey: 'maChuyenKhoa',
                as: 'danhSachChuyenKhoa'
            });
        }
    }

    ThongTinBacSi.init({
        maBacSi: DataTypes.INTEGER,
        donGia: DataTypes.DECIMAL,
        soLanKham: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        moTa: DataTypes.TEXT,
        noiDungHTML: DataTypes.TEXT('long'),
        noiDungMarkdown: DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'ThongTinBacSi',
        tableName: 'ThongTinBacSi',
        freezeTableName: true,
    });

    return ThongTinBacSi;
};