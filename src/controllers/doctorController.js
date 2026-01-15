import doctorService from "../services/doctorService.js";

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailDoctor(req.body);

        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let handleGetAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi server!'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let infor = await doctorService.getAllSpecialty();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({ errCode: -1, errMessage: 'Lỗi từ server!' })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let getScheduleDates = async (req, res) => {
    try {
        let response = await doctorService.getScheduleDatesByDoctorId(req.query.doctorId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let handleUpdateDoctorProfile = async (req, res) => {
    try {
        let response = await doctorService.updateDoctorProfile(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);

        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let response = await doctorService.sendRemedy(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        })
    }
}

let bulkCreateScheduleForWeek = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleForWeek(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server!'
        });
    }
}

module.exports = {
    postInforDoctor,
    handleGetAllDoctors,
    getDetailDoctorById,
    getAllSpecialty,
    bulkCreateSchedule,
    getScheduleByDate,
    getScheduleDates,
    handleUpdateDoctorProfile,
    getListPatientForDoctor,
    sendRemedy,
    bulkCreateScheduleForWeek
}