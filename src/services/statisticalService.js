import db from "../models/index.js";
const { Op } = require("sequelize");

let getAdminDashboardStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let cards = {};
            let pieChart = [];
            let barChart = [];

            cards.countDoctors = await db.NguoiDung.count({
                where: { maVaiTro: 'R2' }
            });

            cards.countPatients = await db.NguoiDung.count({
                where: { maVaiTro: 'R3' }
            });

            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            cards.countBookingToday = await db.DatLich.count({
                where: {
                    ngayHen: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow
                    }
                }
            });

            cards.countBookingDone = await db.DatLich.count({
                where: { maTrangThai: 'S3' }
            });

            let statusData = await db.DatLich.findAll({
                attributes: [
                    'maTrangThai',
                    [db.sequelize.fn('COUNT', db.sequelize.col('maTrangThai')), 'value']
                ],
                group: ['maTrangThai'],
                raw: true
            });

            if (statusData && statusData.length > 0) {
                pieChart = statusData.map(item => {
                    let name = '';
                    switch (item.maTrangThai) {
                        case 'S1': name = 'Lịch mới'; break;
                        case 'S2': name = 'Đã xác nhận'; break;
                        case 'S3': name = 'Đã khám'; break;
                        case 'S4': name = 'Đã hủy'; break;
                        default: name = 'Khác';
                    }
                    return { name: name, value: parseInt(item.value) };
                });
            }

            let monthlyData = await db.sequelize.query(`
                SELECT MONTH(ngayHen) as month, COUNT(*) as value
                FROM DatLich
                WHERE maTrangThai = 'S3' AND YEAR(ngayHen) = YEAR(CURDATE())
                GROUP BY MONTH(ngayHen)
                ORDER BY month ASC
            `, { type: db.sequelize.QueryTypes.SELECT });

            for (let i = 1; i <= 12; i++) {
                let found = monthlyData.find(item => item.month === i);
                barChart.push({
                    name: `Tháng ${i}`,
                    value: found ? found.value : 0
                });
            }

            resolve({
                errCode: 0,
                data: {
                    cards: cards,
                    pieChart: pieChart,
                    barChart: barChart
                }
            });

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAdminDashboardStats: getAdminDashboardStats
}