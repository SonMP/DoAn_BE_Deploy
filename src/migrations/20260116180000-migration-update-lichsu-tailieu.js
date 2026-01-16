module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('LichSu', 'taiLieu', {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('LichSu', 'taiLieu', {
                type: Sequelize.TEXT,
                allowNull: true,
            })
        ]);
    }
};
