import specialtyService from '../services/specialtyService.js';

let createSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let { limit, page } = req.query;
        let response = await specialtyService.getAllSpecialty(limit, page);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialtyById(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        })
    }
}

let updateSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.updateSpecialty(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        })
    }
}

let deleteSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.deleteSpecialty(req.body.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        })
    }
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    updateSpecialty: updateSpecialty,
    deleteSpecialty: deleteSpecialty
}