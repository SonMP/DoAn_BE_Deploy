import db from "../models/index.js";
require('dotenv').config();
import _ from 'lodash';
import emailService from './emailService.js';

const { Op } = require("sequelize");
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE || 10;

let saveDetailDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.maBacSi || !inputData.noiDungHTML ||
                !inputData.noiDungMarkdown || !inputData.action) {

                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu truyền vào!'
                })
            } else {

                if (inputData.action === 'CREATE') {
                    await db.ThongTinBacSi.create({
                        maBacSi: inputData.maBacSi,
                        donGia: inputData.donGia,
                        moTa: inputData.moTa,
                        noiDungHTML: inputData.noiDungHTML,
                        noiDungMarkdown: inputData.noiDungMarkdown
                    })
                } else if (inputData.action === 'EDIT') {

                    let doctorInfo = await db.ThongTinBacSi.findOne({
                        where: { maBacSi: inputData.maBacSi },
                        raw: false
                    })

                    if (doctorInfo) {
                        doctorInfo.donGia = inputData.donGia;
                        doctorInfo.moTa = inputData.moTa;
                        doctorInfo.noiDungHTML = inputData.noiDungHTML;
                        doctorInfo.noiDungMarkdown = inputData.noiDungMarkdown;

                        await doctorInfo.save();
                    }
                }
                let listSpecialtyIds = [];
                if (Array.isArray(inputData.specialtyIds)) {
                    listSpecialtyIds = inputData.specialtyIds;
                } else if (inputData.specialtyId) {
                    listSpecialtyIds.push(inputData.specialtyId)
                }

                if (listSpecialtyIds && listSpecialtyIds.length > 0) {
                    await db.BacSi_ChuyenKhoa.destroy({
                        where: { maBacSi: inputData.maBacSi }
                    });

                    let bulkSpecialty = listSpecialtyIds.map(item => {
                        return {
                            maBacSi: inputData.maBacSi,
                            maChuyenKhoa: item
                        }
                    });
                    await db.BacSi_ChuyenKhoa.bulkCreate(bulkSpecialty);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Lưu thông tin bác sĩ thành công!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = (limitInput, pageInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                where: { maVaiTro: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['matKhau']
                },
                include: [
                    {
                        model: db.QuyDinh,
                        as: 'duLieuViTri',
                        attributes: ['giaTriEn', 'giaTriVi']
                    },
                    {
                        model: db.QuyDinh,
                        as: 'duLieuGioiTinh',
                        attributes: ['giaTriEn', 'giaTriVi']
                    },
                    {
                        model: db.ThongTinBacSi,
                        as: 'thongTinChiTiet',
                        attributes: ['donGia', 'moTa'],
                        include: [
                            { model: db.ChuyenKhoa, as: 'danhSachChuyenKhoa', attributes: ['ten', 'id'], through: { attributes: [] } }
                        ]
                    }
                ],
                raw: false,
                nest: true
            };

            if (limitInput && pageInput) {
                let limit = +limitInput;
                let page = +pageInput;
                let offset = (page - 1) * limit;
                options.limit = limit;
                options.offset = offset;
            }

            let doctors = await db.NguoiDung.findAll(options);

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({ errCode: 1, errMessage: 'Thiếu dữ liệu truyền vào!' })
            } else {
                let data = await db.NguoiDung.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['matKhau']
                    },
                    include: [
                        {
                            model: db.ThongTinBacSi,
                            as: 'thongTinChiTiet',
                            attributes: ['noiDungHTML', 'noiDungMarkdown', 'moTa', 'donGia'],

                            include: [
                                { model: db.ChuyenKhoa, as: 'danhSachChuyenKhoa', attributes: ['ten', 'id'], through: { attributes: [] } }
                            ]
                        },
                        {
                            model: db.QuyDinh,
                            as: 'duLieuViTri',
                            attributes: ['giaTriEn', 'giaTriVi']
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data) {
                    data = data.get({ plain: true });
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.arrSchedule || !data.maBacSi || !data.ngayHen) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu truyền vào!'
                })
            } else {
                let lichTrinh = data.arrSchedule;

                let dateTimestamp = Number(data.ngayHen);

                if (lichTrinh && lichTrinh.length > 0) {
                    lichTrinh = lichTrinh.map(item => {
                        item.soLuongToiDa = MAX_NUMBER_SCHEDULE;
                        item.ngayHen = dateTimestamp;
                        item.maBacSi = data.maBacSi;
                        item.soLuongHienTai = 0;
                        return item;
                    })
                }

                let existing = await db.LichTrinh.findAll({
                    where: {
                        maBacSi: data.maBacSi,
                        ngayHen: dateTimestamp
                    },
                    attributes: ['khungThoiGian', 'ngayHen', 'maBacSi', 'soLuongToiDa'],
                    raw: true
                })

                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.ngayHen = new Date(item.ngayHen).getTime();
                        return item;
                    })
                }

                let toCreate = _.differenceWith(lichTrinh, existing, (a, b) => {
                    return a.khungThoiGian === b.khungThoiGian;
                });

                let toDelete = _.differenceWith(existing, lichTrinh, (a, b) => {
                    return a.khungThoiGian === b.khungThoiGian;
                });

                if (toDelete && toDelete.length > 0) {
                    let arrDelete = toDelete.map(item => item.khungThoiGian);

                    await db.LichTrinh.destroy({
                        where: {
                            maBacSi: data.maBacSi,
                            ngayHen: dateTimestamp,
                            khungThoiGian: arrDelete
                        }
                    });
                }

                if (toCreate && toCreate.length > 0) {
                    await db.LichTrinh.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu truyền vào!'
                })
            } else {
                let dateToSearch = new Date(Number(date));
                if (isNaN(dateToSearch.getTime())) {
                    resolve({
                        errCode: 0,
                        data: []
                    });
                    return;
                }

                let data = await db.LichTrinh.findAll({
                    where: {
                        maBacSi: doctorId,
                        ngayHen: dateToSearch
                    },
                    include: [
                        {
                            model: db.QuyDinh,
                            as: 'thoiGianData',
                            attributes: ['giaTriEn', 'giaTriVi', 'khoa']
                        },
                        {
                            model: db.NguoiDung,
                            as: 'bacSiData',
                            attributes: ['ten', 'ho']
                        }
                    ],
                    order: [
                        ['khungThoiGian', 'ASC']
                    ],
                    raw: true,
                    nest: true
                })

                let bookingS2 = await db.DatLich.findAll({
                    where: {
                        maBacSi: doctorId,
                        ngayHen: dateToSearch,
                        maTrangThai: 'S2'
                    },
                    attributes: ['khungThoiGian'],
                    raw: true
                });

                let listTimeDaDat = bookingS2.map(item => item.khungThoiGian);

                if (data && data.length > 0) {
                    data = data.map(item => {
                        if (listTimeDaDat.includes(item.khungThoiGian)) {
                            item.daBiDat = true;
                        } else {
                            item.daBiDat = false;
                        }
                        return item;
                    });
                }

                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleDatesByDoctorId = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu dữ liệu truyền vào!"
                });
            } else {
                let currentDate = new Date().setHours(0, 0, 0, 0);

                let schedules = await db.LichTrinh.findAll({
                    where: {
                        maBacSi: doctorId,
                        ngayHen: {
                            [db.Sequelize.Op.gte]: currentDate
                        },
                    },
                    attributes: ['ngayHen'],
                    group: ['ngayHen'],
                    order: [['ngayHen', 'ASC']]
                });

                resolve({
                    errCode: 0,
                    data: schedules
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}


let updateDoctorProfile = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số bắt buộc (ID bác sĩ)!"
                });
            } else {
                let user = await db.NguoiDung.findOne({
                    where: { id: inputData.id },
                    raw: false
                });

                if (user) {
                    user.diaChi = inputData.diaChi;
                    user.soDienThoai = inputData.soDienThoai;
                    user.gioiTinh = inputData.gioiTinh;
                    user.maViTri = inputData.maViTri;
                    if (inputData.hinhAnh) {
                        user.hinhAnh = inputData.hinhAnh;
                    }

                    await user.save();
                }


                let doctorInfo = await db.ThongTinBacSi.findOne({
                    where: { maBacSi: inputData.id },
                    raw: false
                });

                if (doctorInfo) {
                    doctorInfo.moTa = inputData.moTa;
                    doctorInfo.noiDungHTML = inputData.noiDungHTML;
                    doctorInfo.noiDungMarkdown = inputData.noiDungMarkdown;
                    doctorInfo.donGia = inputData.donGia;

                    doctorInfo.updatedAt = new Date();

                    await doctorInfo.save();
                } else {
                    await db.ThongTinBacSi.create({
                        maBacSi: inputData.id,
                        moTa: inputData.moTa,
                        noiDungHTML: inputData.noiDungHTML,
                        noiDungMarkdown: inputData.noiDungMarkdown,
                        donGia: inputData.donGia,
                        soLanKham: 0
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "Cập nhật thông tin thành công!"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}


let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({ errCode: 1, errMessage: 'Thiếu tham số bắt buộc (DoctorID hoặc Date)' });
            } else {
                let startDay = new Date(parseInt(date));
                startDay.setHours(0, 0, 0, 0);
                let endDay = new Date(parseInt(date));
                endDay.setHours(23, 59, 59, 999);

                let data = await db.DatLich.findAll({
                    where: {
                        maBacSi: doctorId,
                        ngayHen: {
                            [Op.between]: [startDay, endDay]
                        },
                        maTrangThai: { [Op.in]: ['S2', 'S3'] }
                    },
                    include: [
                        {
                            model: db.NguoiDung,
                            as: 'thongTinBenhNhan',
                            attributes: ['email', 'ho', 'ten', 'diaChi', 'gioiTinh'],
                            include: [

                                {
                                    model: db.QuyDinh,
                                    as: 'duLieuGioiTinh',
                                    attributes: ['giaTriVi', 'giaTriEn']
                                }
                            ]
                        },
                        {
                            model: db.QuyDinh,
                            as: 'thoiGianData',
                            attributes: ['giaTriVi', 'giaTriEn']
                        },
                        {
                            model: db.QuyDinh,
                            as: 'trangThaiData',
                            attributes: ['giaTriVi', 'giaTriEn']
                        }
                    ],
                    raw: false,
                    nest: true
                });

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu truyền vào'
                })
            } else {
                let appointment = await db.DatLich.findOne({
                    where: {
                        maBacSi: data.doctorId,
                        maBenhNhan: data.patientId,
                        khungThoiGian: data.timeType,
                        maTrangThai: 'S2'
                    },
                    raw: false
                });

                if (appointment) {
                    await emailService.sendAttachment(data);
                    appointment.maTrangThai = 'S3';
                    await appointment.save();

                    await db.LichSu.create({
                        maBacSi: data.doctorId,
                        maBenhNhan: data.patientId,
                        moTa: data.description,
                        taiLieu: data.imgBase64,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateScheduleForWeek = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.maBacSi || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu truyền vào'
                });
            } else {
                let scheduleToCreate = [];

                let allTime = await db.QuyDinh.findAll({
                    where: { loai: 'TIME' },
                    attributes: ['khoa', 'giaTriVi', 'giaTriEn'],
                    raw: true
                });

                let currentDate = new Date(parseInt(data.date));
                currentDate.setHours(0, 0, 0, 0);
                for (let i = 0; i < 7; i++) {
                    let nextDate = new Date(currentDate);
                    nextDate.setDate(currentDate.getDate() + i);
                    nextDate.setHours(0, 0, 0, 0);

                    let timeStamp = nextDate.getTime();

                    if (allTime && allTime.length > 0) {
                        allTime.forEach(time => {
                            scheduleToCreate.push({
                                maBacSi: data.maBacSi,
                                ngayHen: timeStamp,
                                khungThoiGian: time.khoa,
                                soLuongToiDa: MAX_NUMBER_SCHEDULE,
                                soLuongHienTai: 0
                            });
                        });
                    }
                }

                let existing = await db.LichTrinh.findAll({
                    where: {
                        maBacSi: data.maBacSi,
                        ngayHen: {
                            [Op.gte]: scheduleToCreate[0].ngayHen,
                            [Op.lte]: scheduleToCreate[scheduleToCreate.length - 1].ngayHen
                        }
                    },
                    attributes: ['ngayHen', 'khungThoiGian', 'maBacSi'],
                    raw: true
                });

                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        let date = new Date(item.ngayHen).getTime();
                        return { ...item, ngayHen: date };
                    })
                }

                let toCreate = _.differenceWith(scheduleToCreate, existing, (a, b) => {
                    return a.khungThoiGian === b.khungThoiGian && +a.ngayHen === +b.ngayHen;
                });

                if (toCreate && toCreate.length > 0) {
                    await db.LichTrinh.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    saveDetailDoctor: saveDetailDoctor,
    getAllDoctors: getAllDoctors,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getScheduleDatesByDoctorId: getScheduleDatesByDoctorId,
    updateDoctorProfile: updateDoctorProfile,
    getDetailDoctorById: getDetailDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
    bulkCreateScheduleForWeek: bulkCreateScheduleForWeek
}