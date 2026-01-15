import db Ô thay thế(Replace): from "../models/index.js";
require('dotenv').config();


let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.ten || !data.hinhAnh) {
                resolve({ errCode: 1, errMessage: 'Thiếu dữ liệu (Tên, Ảnh)' })
            } else {
                await db.ChuyenKhoa.create({
                    ten: data.ten,
                    hinhAnh: data.hinhAnh,
                    moTa: data.description,
                    noiDungHTML: data.descriptionHTML,
                    noiDungMarkdown: data.descriptionMarkdown
                })
                resolve({ errCode: 0, errMessage: 'OK' })
            }
        } catch (e) { reject(e); }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.ChuyenKhoa.findAll({
                attributes: ['id', 'ten', 'hinhAnh', 'moTa', 'noiDungHTML', 'noiDungMarkdown']
            });

            resolve({ errCode: 0, errMessage: 'OK', data })
        } catch (e) { reject(e); }
    })
}

let getDetailSpecialtyById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({ errCode: 1, errMessage: 'Thiếu dữ liệu' });
            } else {
                let data = await db.ChuyenKhoa.findOne({
                    where: { id: inputId },
                    attributes: ['moTa', 'noiDungHTML', 'noiDungMarkdown', 'ten', 'hinhAnh'],
                    include: [
                        {
                            model: db.ThongTinBacSi,
                            as: 'danhSachBacSi',
                            attributes: ['maBacSi', 'donGia', 'moTa'],
                            include: [
                                {
                                    model: db.NguoiDung,
                                    as: 'thongTinNguoiDung',
                                    attributes: ['ten', 'ho', 'diaChi', 'maViTri', 'email', 'hinhAnh']
                                }
                            ],
                            through: { attributes: [] }
                        }
                    ],
                    raw: false,
                    nest: true
                });

                resolve({ errCode: 0, errMessage: 'OK', data });
            }
        } catch (e) { reject(e); }
    })
}

let updateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.ten) {
                resolve({ errCode: 2, errMessage: 'Thiếu dữ liệu truyền vào' });
            }

            let specialty = await db.ChuyenKhoa.findOne({
                where: { id: data.id },
                raw: false
            });

            if (specialty) {
                specialty.ten = data.ten;
                specialty.hinhAnh = data.hinhAnh;
                specialty.moTa = data.description;
                specialty.noiDungHTML = data.descriptionHTML;
                specialty.noiDungMarkdown = data.descriptionMarkdown;
                if (data.hinhAnh) {
                    specialty.hinhAnh = data.hinhAnh;
                }
                await specialty.save();
                resolve({ errCode: 0, errMessage: 'Update thành công!' });
            } else {
                resolve({ errCode: 1, errMessage: 'Không tìm thấy chuyên khoa' });
            }
        } catch (e) { reject(e); }
    })
}

let deleteSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.ChuyenKhoa.findOne({ where: { id: id }, raw: false });
            if (!specialty) {
                resolve({ errCode: 2, errMessage: 'Chuyên khoa không tồn tại' });
            }
            await specialty.destroy();
            resolve({ errCode: 0, errMessage: 'Đã xóa chuyên khoa!' });
        } catch (e) { reject(e); }
    })
}

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    updateSpecialty,
    deleteSpecialty
}