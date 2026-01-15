import patientService from '../services/patientService.js';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let getHistoryByPatientId = async (req, res) => {
    try {
        let infor = await patientService.getHistoryByPatientId(req.query.patientId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let getBookingByEmail = async (req, res) => {
    try {
        let info = await patientService.getBookingByEmail(req.query.email);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({ errCode: -1, errMessage: 'Lỗi từ server!' });
    }
}

let cancelBooking = async (req, res) => {
    try {
        let info = await patientService.cancelBooking(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({ errCode: -1, errMessage: 'Lỗi từ server!' });
    }
}

let postVerifyCancelBooking = async (req, res) => {
    try {
        let infor = await patientService.postVerifyCancelBooking(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let verifyCancelBooking = async (req, res) => {
    try {
        let infor = await patientService.verifyCancelBooking(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getHistoryByPatientId: getHistoryByPatientId,
    getBookingByEmail: getBookingByEmail,
    postVerifyCancelBooking: postVerifyCancelBooking,
    verifyCancelBooking: verifyCancelBooking
}