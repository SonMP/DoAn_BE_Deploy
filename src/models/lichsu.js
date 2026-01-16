'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LichSu extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            LichSu.belongsTo(models.NguoiDung, { foreignKey: 'maBacSi', targetKey: 'id', as: 'bacSiData' });

            LichSu.belongsTo(models.NguoiDung, { foreignKey: 'maBenhNhan', targetKey: 'id', as: 'benhNhanData' });
        }
    }
    LichSu.init({
        maBenhNhan: DataTypes.INTEGER,
        maBacSi: DataTypes.INTEGER,
        moTa: DataTypes.TEXT,
        taiLieu: DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'LichSu',
        tableName: 'LichSu',
        freezeTableName: true
    });
    return LichSu;
};