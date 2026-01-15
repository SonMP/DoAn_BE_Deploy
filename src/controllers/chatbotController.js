import chatbotService from "../services/chatbotService";

let handleChatBot = async (req, res) => {
    try {
        let response = await chatbotService.handleChatBotService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi Controller handleChatBot:", e);
        return res.status(200).json({
            errCode: -1,
            message: 'Lỗi từ server!'
        });
    }
}

let getChatHistoryByUser = async (req, res) => {
    try {
        let response = await chatbotService.getChatHistoryByUserService(req.query.userId);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi Controller getChatHistoryByUser:", e);
        return res.status(200).json({ errCode: -1, message: 'Lỗi từ server!' });
    }
}

let getPatientChatSummary = async (req, res) => {
    try {
        let response = await chatbotService.getPatientChatSummaryService(req.query.patientId);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi Controller getPatientChatSummary:", e);
        return res.status(200).json({ errCode: -1, message: 'Lỗi từ server!' });
    }
}

module.exports = {
    handleChatBot,
    getChatHistoryByUser,
    getPatientChatSummary
}