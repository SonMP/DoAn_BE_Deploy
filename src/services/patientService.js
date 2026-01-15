import db from "../models/index.js";
require('dotenv').config();
import emailService from './emailService.js';
import { v4 as uuidv4 } from 'uuid';

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu truyền vào.'
                })
            } else {
                let ho = '';
                let ten = '';
                if (data.fullName) {
                    let arrName = data.fullName.split(' ');
                    if (arrName.length > 0) {
                        ten = arrName.pop();
                        ho = arrName.join(' ');
                    }
                }


                let [user, created] = await db.NguoiDung.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        maVaiTro: 'R3',
                        gioiTinh: data.selectedGender,
                        diaChi: data.address,
                        soDienThoai: data.phoneNumber,
                        ho: ho,
                        ten: ten
                    },
                    raw: false
                });

                if (!created) {
                    user.email = data.email;
                    user.diaChi = data.address;
                    user.soDienThoai = data.phoneNumber;
                    user.gioiTinh = data.selectedGender;
                    user.ho = ho;
                    user.ten = ten;
                    await user.save();
                }

                if (user) {
                    let token = uuidv4();
                    let [booking, createdBooking] = await db.DatLich.findOrCreate({
                        where: {
                            maBenhNhan: user.id,
                            ngayHen: data.date,
                            khungThoiGian: data.timeType
                        },
                        defaults: {
                            maTrangThai: 'S1',
                            maBacSi: data.doctorId,
                            maBenhNhan: user.id,
                            ngayHen: data.date,
                            khungThoiGian: data.timeType,
                            lyDo: data.reason,
                            token: token
                        }
                    });
                    if (createdBooking) {
                        await emailService.sendSimpleEmail({
                            receiverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${data.doctorId}`
                        });
                        resolve({
                            errCode: 0,
                            errMessage: 'Lưu thông tin bệnh nhân thành công!'
                        })

                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Lịch hẹn đã có sẵn!'
                        })
                    }

                }

            }
        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!'
                })
            } else {
                let appointment = await db.DatLich.findOne({
                    where: {
                        maBacSi: data.doctorId,
                        token: data.token,
                        maTrangThai: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    let isExistBooking = await db.DatLich.findOne({
                        where: {
                            maBacSi: data.doctorId,
                            ngayHen: appointment.ngayHen,
                            khungThoiGian: appointment.khungThoiGian,
                            maTrangThai: 'S2'
                        }
                    });

                    if (isExistBooking) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Lịch khám này đã được người khác xác nhận vừa xong. Vui lòng đặt lịch lại!'
                        })
                    } else {
                        appointment.maTrangThai = 'S2';
                        await appointment.save();

                        let doctorInfo = await db.ThongTinBacSi.findOne({
                            where: { maBacSi: data.doctorId },
                            raw: false
                        });

                        if (doctorInfo) {
                            doctorInfo.soLanKham = doctorInfo.soLanKham + 1;
                            await doctorInfo.save();
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Cập nhật cuộc hẹn thành công'
                        })
                    }

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Cuộc hẹn đã được kích hoạt hoặc không tồn tại'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getHistoryByPatientId = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({ errCode: 1, errMessage: 'Thiếu dữ liệu truyền vào!' })
            } else {
                let history = await db.LichSu.findAll({
                    where: { maBenhNhan: patientId },
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: db.NguoiDung, as: 'bacSiData', attributes: ['ho', 'ten'] }
                    ],
                    include: [
                        { model: db.NguoiDung, as: 'benhNhanData', attributes: ['ho', 'ten'] }
                    ],
                    raw: true,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: history
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getBookingByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({ errCode: 1, errMessage: 'Thiếu dữ liệu truyền vào!' });
            } else {
                let user = await db.NguoiDung.findOne({
                    where: { email: email },
                    attributes: ['id', 'email']
                });

                if (!user) {
                    resolve({
                        errCode: 0,
                        data: []
                    });
                    return;
                }

                let bookings = await db.DatLich.findAll({
                    where: {
                        maBenhNhan: user.id,
                        maTrangThai: ['S1', 'S2', 'S3', 'S4']
                    },
                    include: [
                        {
                            model: db.NguoiDung, as: 'thongTinBacSi',
                            attributes: ['email', 'ten', 'ho', 'diaChi', 'soDienThoai'],
                            include: [
                                { model: db.QuyDinh, as: 'duLieuGioiTinh', attributes: ['giaTriEn', 'giaTriVi'] }
                            ]
                        },
                        {
                            model: db.QuyDinh, as: 'thoiGianData', attributes: ['giaTriEn', 'giaTriVi']
                        },
                        {
                            model: db.QuyDinh, as: 'trangThaiData', attributes: ['giaTriEn', 'giaTriVi']
                        },
                        {
                            model: db.NguoiDung, as: 'thongTinBenhNhan', attributes: ['ho', 'ten']
                        }
                    ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    data: bookings
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}&isCancel=true`;
    return result;
}

let postVerifyCancelBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu truyền vào!'
                })
            } else {
                let doctor = await db.NguoiDung.findOne({
                    where: { id: data.doctorId },
                    attributes: ['ho', 'ten'],
                    raw: true
                });
                let doctorName = doctor ? `${doctor.ho} ${doctor.ten}` : '';

                let token = uuidv4();

                await emailService.sendCancelEmail({
                    receiverEmail: data.email,
                    patientName: data.customerName,
                    time: data.timeString,
                    doctorName: doctorName,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });

                let appointment = await db.DatLich.findOne({
                    where: {
                        maBenhNhan: data.patientId,
                        maBacSi: data.doctorId,
                        khungThoiGian: data.timeType,
                        maTrangThai: ['S1', 'S2']
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.token = token;
                    await appointment.save();
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Yêu cầu hủy đã được gửi, vui lòng kiểm tra email!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let verifyCancelBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu'
                })
            } else {
                let appointment = await db.DatLich.findOne({
                    where: {
                        maBacSi: data.doctorId,
                        token: data.token,
                        maTrangThai: ['S1', 'S2']
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.maTrangThai = 'S4';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Hủy lịch hẹn thành công!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Lịch hẹn đã bị hủy trước đó hoặc token không hợp lệ"
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getHistoryByPatientId: getHistoryByPatientId,
    getBookingByEmail: getBookingByEmail,
    postVerifyCancelBooking: postVerifyCancelBooking,
    verifyCancelBooking: verifyCancelBooking
}
