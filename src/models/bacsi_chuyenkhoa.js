'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BacSi_ChuyenKhoa extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BacSi_ChuyenKhoa.belongsTo(models.ThongTinBacSi, {
                foreignKey: 'maBacSi',
                targetKey: 'maBacSi',
                as: 'chiTietBacSi'
            });

            BacSi_ChuyenKhoa.belongsTo(models.ChuyenKhoa, {
                foreignKey: 'maChuyenKhoa',
                targetKey: 'id',
                as: 'chiTietChuyenKhoa'
            });
        }
    }
    BacSi_ChuyenKhoa.init({
        maBacSi: DataTypes.INTEGER,
        maChuyenKhoa: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'BacSi_ChuyenKhoa',
        tableName: 'BacSi_ChuyenKhoa',
        freezeTableName: true
    });
    return BacSi_ChuyenKhoa;
};