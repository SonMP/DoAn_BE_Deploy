import bcrypt from "bcryptjs";
import db from "../models";

const salt = bcrypt.genSaltSync(10);

let taoNguoiDung = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let matKhau = await hashPassword(data.matkhau);
            await db.NguoiDung.create({
                email: data.email,
                matKhau: matKhau,
                ho: data.ho,
                ten: data.ten,
                hinhAnh: data.hinhanh,
                diaChi: data.diachi,
                soDienThoai: data.sodienthoai,
                gioiTinh: data.gioitinh === '1' ? true : false,
                maVaiTro: data.vaitro,
            });
            resolve('Tạo người dùng thành công');
        } catch (e) {
            reject(e)
        }
    })
}

let layNguoiDung = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let nguoiDung = db.NguoiDung.findAll({
                raw: true
            });
            resolve(nguoiDung);
        } catch (e) {
            reject(e)
        }
    })
}
let layNguoiDungTheoMa = (maNguoiDung) => {
    return new Promise((resolve, reject) => {
        try {
            if (maNguoiDung) {
                let nguoiDung = db.NguoiDung.findOne({
                    where: { id: maNguoiDung },
                    raw: true
                })
                resolve(nguoiDung)
            } else {
                resolve({})
            }
        } catch (e) {
            reject(e)
        }
    })
}

let hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e)
        }

    })
}
let capNhatNguoiDung = (duLieu) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nguoiDung = await db.NguoiDung.findOne({
                where: { id: duLieu.id }
            })
            if (nguoiDung) {
                nguoiDung.email = duLieu.email;
                nguoiDung.ten = duLieu.ten;
                nguoiDung.ho = duLieu.ho;
                nguoiDung.diaChi = duLieu.diachi;
                nguoiDung.soDienThoai = duLieu.sodienthoai;
                nguoiDung.gioiTinh = duLieu.gioitinh;
                nguoiDung.maVaiTro = duLieu.vaitro;
                nguoiDung.save();
                resolve("Cập nhật thành công");
            } else (
                reject("Không tìm thấy người dùng!")
            )

        } catch (e) {
            reject(e)
        }
    })
}
let xoaNguoiDung = (maNguoiDung) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nguoiDung = await db.NguoiDung.findOne({
                where: { id: maNguoiDung }
            })
            if (nguoiDung) {
                await nguoiDung.destroy();
            } else (
                reject("Không tìm thấy người dùng!")
            )
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    taoNguoiDung: taoNguoiDung,
    layNguoiDung: layNguoiDung,
    layNguoiDungTheoMa: layNguoiDungTheoMa,
    capNhatNguoiDung: capNhatNguoiDung,
    xoaNguoiDung: xoaNguoiDung
}