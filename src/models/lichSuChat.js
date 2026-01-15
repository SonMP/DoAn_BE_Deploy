'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LichSuChat extends Model {
        /**
         * Helper method for defining associations.
         */
        static associate(models) {

            LichSuChat.belongsTo(models.NguoiDung, {
                foreignKey: 'maBenhNhan',
                targetKey: 'id',
                as: 'thongTinBenhNhan'
            });
        }
    };
    LichSuChat.init({
        maBenhNhan: DataTypes.INTEGER,
        noiDung: DataTypes.TEXT,
        laBot: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'LichSuChat',
        tableName: 'LichSuChat',
        freezeTableName: true
    });
    return LichSuChat;
};