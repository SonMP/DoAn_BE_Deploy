import userService from "../services/userService.js";
import seedDoctors from "../services/seedDoctors.js";

let handlePatientSignUp = async (req, res) => {
    try {
        let message = await userService.createNewPatient(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            message: "Nhập thiếu email hoặc mật khẩu!"
        })
    }
    let userData = await userService.handleLoginService(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user ? userData.user : {},
        token: userData.token ? userData.token : null
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    })
}
let handleCreateNewUser = async (req, res) => {
    let data = req.body;
    let message = await userService.createNewUser(data);
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: "Không tìm thấy người dùng!"
        })
    }
    let message = await userService.deleteUser(id);
    return res.status(200).json(message)
}
let getQuyDinh = async (req, res) => {
    try {
        let typeInput = req.query.loai;
        let data = await userService.getQuyDinhService(typeInput);
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
}

let getDoctorHome = async (req, res) => {
    try {
        let data = await userService.getDoctorService();
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
}

let handleSeedData = async (req, res) => {
    try {
        let message = await seedDoctors.bulkCreateDoctors();
        return res.send(message);
    } catch (e) {
        console.log(e);
        return res.send("Lỗi server khi seed data!");
    }
}



module.exports = {
    handlePatientSignUp: handlePatientSignUp,
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getQuyDinh: getQuyDinh,
    getDoctorHome: getDoctorHome,
    handleSeedData: handleSeedData,
}
