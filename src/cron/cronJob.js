import cron from 'node-cron';
import db from '../models';
import { Op } from 'sequelize';

let job = cron.schedule('*/30 * * * *', async () => {
    console.log('--- Bắt đầu quét lịch hẹn ảo ---');
    try {
        let twoHoursAgo = new Date(new Date() - 2 * 60 * 60 * 1000);

        let ghostAppointments = await db.DatLich.destroy({
            where: {
                maTrangThai: 'S1',
                createdAt: {
                    [Op.lt]: twoHoursAgo
                }
            }
        });

        if (ghostAppointments > 0) {
            console.log(`Đã xóa ${ghostAppointments} lịch hẹn ảo!`);
        }
    } catch (e) {
        console.log(e);
    }
});

job.start();