'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChuyenKhoa extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ChuyenKhoa.belongsToMany(models.ThongTinBacSi, {
                through: models.BacSi_ChuyenKhoa,
                foreignKey: 'maChuyenKhoa',
                targetKey: 'maBacSi',
                otherKey: 'maBacSi',
                as: 'danhSachBacSi'
            });
        }

    }
    ChuyenKhoa.init({
        ten: DataTypes.STRING,
        moTa: DataTypes.TEXT,
        hinhAnh: DataTypes.TEXT('long'),
        noiDungHTML: DataTypes.TEXT,
        noiDungMarkdown: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'ChuyenKhoa',
        tableName: 'ChuyenKhoa',
        freezeTableName: true
    });
    return ChuyenKhoa;
};