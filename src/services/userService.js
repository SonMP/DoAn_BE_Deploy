import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { where } from "sequelize";
import emailService from './emailService.js';
import { v4 as uuidv4 } from 'uuid';

const salt = bcrypt.genSaltSync(10);

const JWT_SECRET = "BENHVIEN_BINHDAN_SECRET_123";
const JWT_EXPIRES_IN = "3h";


let handleLoginService = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let user = await db.NguoiDung.findOne({
                attributes: ["id", "email", "ho", "ten", "diaChi", "soDienThoai", "maVaiTro", "matKhau"],
                where: { email: email },
                raw: true
            });

            if (!user) {
                userData.errCode = 1;
                userData.message = "Email không tồn tại!";
                return resolve(userData);
            }

            let check = await bcrypt.compare(password, user.matKhau);

            if (!check) {
                userData.errCode = 1;
                userData.message = "Sai mật khẩu!";
                return resolve(userData);
            }

            delete user.matKhau;

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.maVaiTro
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            userData.errCode = 0;
            userData.message = "Đăng nhập thành công!";
            userData.user = user;
            userData.token = token;

            return resolve(userData);

        } catch (e) {
            return reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';

            if (userId === 'ALL') {
                users = await db.NguoiDung.findAll({
                    attributes: {
                        exclude: ['matKhau']
                    },
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: db.QuyDinh, as: 'duLieuVaiTro', attributes: ['giaTriEn', 'giaTriVi'] },
                        { model: db.QuyDinh, as: 'duLieuGioiTinh', attributes: ['giaTriEn', 'giaTriVi'] },
                        { model: db.QuyDinh, as: 'duLieuViTri', attributes: ['giaTriEn', 'giaTriVi'] },
                    ],
                    raw: true,
                    nest: true
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.NguoiDung.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['matKhau']
                    }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e)
        }
    })
}

let createNewPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.NguoiDung.findOne({
                where: { email: data.email }
            });

            let hashPasswordFromBcrypt = await hashPassword(data.matKhau);

            if (user) {

                if (user.matKhau) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Email này đã được sử dụng. Vui lòng chọn email khác!'
                    });
                } else {
                    await db.NguoiDung.update(
                        {
                            matKhau: hashPasswordFromBcrypt,
                            ten: data.ten,
                            ho: data.ho,
                            diaChi: data.diaChi,
                            soDienThoai: data.soDienThoai,
                            gioiTinh: data.gioiTinh,
                            maVaiTro: 'R3',
                            updatedAt: new Date()
                        },
                        {
                            where: { email: data.email }
                        }
                    );
                    resolve({
                        errCode: 0,
                        message: 'Đăng ký thành công (Tài khoản cũ đã được kích hoạt)!'
                    });
                }
            } else {
                await db.NguoiDung.create({
                    email: data.email,
                    matKhau: hashPasswordFromBcrypt,
                    ten: data.ten,
                    ho: data.ho,
                    diaChi: data.diaChi,
                    soDienThoai: data.soDienThoai,
                    gioiTinh: data.gioiTinh,
                    maVaiTro: 'R3',
                    maViTri: null,
                    hinhAnh: null
                });

                resolve({
                    errCode: 0,
                    message: 'Đăng ký thành công!'
                });
            }

        } catch (e) {
            reject(e);
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

let checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.NguoiDung.findOne({
                where: { email: email }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    message: "Email đã tồn tại!"
                })
            }
            else {
                let matKhau = await hashPassword(data.matKhau);
                await db.NguoiDung.create({
                    email: data.email,
                    matKhau: matKhau,
                    ho: data.ho,
                    ten: data.ten,
                    hinhAnh: data.hinhAnh,
                    diaChi: data.diaChi,
                    soDienThoai: data.soDienThoai,
                    gioiTinh: data.gioiTinh,
                    maVaiTro: data.maVaiTro,
                    maViTri: data.maViTri
                });
                resolve({
                    errCode: 0,
                    message: "Tạo người dùng thành công"
                });
            }

        } catch (e) {
            reject(e)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.maVaiTro) {
                resolve({
                    errCode: 2,
                    message: "Thiếu dữ liệu truyền vào!"
                })
            }

            let user = await db.NguoiDung.findOne({
                where: { id: data.id },
                raw: false
            })

            if (user) {
                user.ten = data.ten;
                user.ho = data.ho;
                user.diaChi = data.diaChi;
                user.soDienThoai = data.soDienThoai;
                user.gioiTinh = data.gioiTinh;
                user.maVaiTro = data.maVaiTro;
                user.maViTri = data.maViTri;
                if (data.hinhAnh) {
                    user.hinhAnh = data.hinhAnh;
                }

                await user.save();

                resolve({
                    errCode: 0,
                    message: "Cập nhật thành công!"
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy người dùng!"
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.NguoiDung.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Người dùng không tồn tại!"
                })
            }
            await user.destroy();
            resolve({
                errCode: 0,
                message: "Xóa người dùng thành công!"
            })
        } catch (e) {
            reject(e)
        }

    })
}

let getQuyDinhService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    message: "Chưa truyền loại cần lấy."

                })
            } else {
                let res = {};
                let quydinh = await db.QuyDinh.findAll({
                    where: { loai: typeInput }
                });
                res.errCode = 0;
                res.data = quydinh;
                resolve(res)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDoctorService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                where: { maVaiTro: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['matKhau']
                },
                include: [
                    { model: db.QuyDinh, as: 'duLieuViTri', attributes: ['giaTriEn', 'giaTriVi'] },

                    { model: db.QuyDinh, as: 'duLieuGioiTinh', attributes: ['giaTriEn', 'giaTriVi'] },

                    {
                        model: db.ThongTinBacSi,
                        as: 'thongTinChiTiet',
                        attributes: ['donGia', 'moTa'],
                        include: [
                            { model: db.ChuyenKhoa, as: 'danhSachChuyenKhoa', attributes: ['ten'], through: { attributes: [] } }
                        ]
                    }
                ],
                raw: false,
                nest: true
            };
            if (limitInput && limitInput !== 'ALL') {
                options.limit = +limitInput;
            }

            let users = await db.NguoiDung.findAll(options);
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let handleForgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let status = {};
            let user = await db.NguoiDung.findOne({
                where: { email: email },
                raw: false
            });

            if (!user) {
                status.errCode = 1;
                status.message = "Email không tồn tại trong hệ thống!";
                resolve(status);
            } else {

                let token = uuidv4();

                let resetToken = jwt.sign({ email: email }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

                let baseUrl = process.env.URL_REACT || 'http://localhost:3000';
                let link = `${baseUrl}/reset-password?token=${resetToken}`;
                await emailService.sendForgotPasswordEmail({
                    receiverEmail: email,
                    redirectLink: link
                });

                status.errCode = 0;
                status.message = "Đã gửi email khôi phục mật khẩu!";
                resolve(status);
            }

        } catch (e) {
            reject(e);
        }
    })
}

let handleResetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.newPassword) {
                resolve({ errCode: 1, message: 'Thiếu tham số!' });
            } else {
                let decoded = null;
                try {
                    decoded = jwt.verify(data.token, process.env.JWT_SECRET || 'secret');
                } catch (err) {
                    resolve({ errCode: 2, message: 'Token không hợp lệ hoặc đã hết hạn!' });
                    return;
                }

                if (decoded && decoded.email) {
                    let user = await db.NguoiDung.findOne({
                        where: { email: decoded.email },
                        raw: false
                    });

                    if (user) {
                        let hashPasswordFromBcrypt = await hashPassword(data.newPassword);
                        user.matKhau = hashPasswordFromBcrypt;
                        await user.save();

                        resolve({ errCode: 0, message: 'Đặt lại mật khẩu thành công!' });
                    } else {
                        resolve({ errCode: 1, message: 'Người dùng không tồn tại!' });
                    }
                } else {
                    resolve({ errCode: 2, message: 'Token không hợp lệ!' });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleLoginService: handleLoginService,
    createNewPatient: createNewPatient,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getQuyDinhService: getQuyDinhService,
    getDoctorService: getDoctorService,
    handleForgotPassword: handleForgotPassword,
    handleResetPassword: handleResetPassword
}