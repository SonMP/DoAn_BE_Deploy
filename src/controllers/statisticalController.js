import statisticalService from "../services/statisticalService.js";

let getAdminDashboardStats = async (req, res) => {
    try {
        let response = await statisticalService.getAdminDashboardStats();
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server'
        })
    }
}

module.exports = {
    getAdminDashboardStats: getAdminDashboardStats
}