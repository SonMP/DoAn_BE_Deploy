import db from "../models/index.js";
const { getDetailedMedicalPrompt } = require("../utils/prompts");
require('dotenv').config();
import { Op } from 'sequelize';

const fetch = require('node-fetch');
if (!global.fetch) {
    global.fetch = fetch;
    global.Headers = fetch.Headers;
    global.Request = fetch.Request;
    global.Response = fetch.Response;
}

const callGeminiDirectly = async (finalInput) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: finalInput }] }],
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};


let handleChatBotService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { message, userId, history } = data;

            if (userId) {
                await db.LichSuChat.create({
                    maBenhNhan: userId,
                    noiDung: message,
                    laBot: false
                });
            }

            let historyContext = "";
            if (userId) {
                let historyDb = await db.LichSuChat.findAll({
                    where: { maBenhNhan: userId },
                    order: [['createdAt', 'DESC']],
                    limit: 10
                });
                historyContext = historyDb.reverse().map(h => {
                    let content = h.noiDung;
                    if (h.laBot) {
                        try {
                            let json = JSON.parse(h.noiDung);
                            content = json.analysis;
                        } catch (e) { }
                    }
                    return `${h.laBot ? 'AI' : 'USER'}: "${content}"`;
                }).join("\n");
            } else if (history && Array.isArray(history)) {
                historyContext = history.map(h => {
                    return `${h.isBot ? 'AI' : 'USER'}: "${h.text}"`;
                }).join("\n");
            }

            let specialties = await db.ChuyenKhoa.findAll({ attributes: ['id', 'ten'] });
            let specialtyString = specialties.map(item => `ID: ${item.id} - ${item.ten}`).join("\n");

            let doctors = await db.NguoiDung.findAll({
                where: { maVaiTro: 'R2' },
                attributes: ['id', 'ten', 'ho']
            });

            let doctorSpecialtyMap = await db.BacSi_ChuyenKhoa.findAll({ attributes: ['maBacSi', 'maChuyenKhoa'] });

            let doctorString = doctors.map(doc => {
                let mapping = doctorSpecialtyMap.find(m => m.maBacSi === doc.id);
                let chuyenKhoaId = mapping ? mapping.maChuyenKhoa : "Chưa rõ";
                return `ID: ${doc.id} - Bác sĩ: ${doc.ho} ${doc.ten} - Thuộc Chuyên khoa ID: ${chuyenKhoaId}`;
            }).join("\n");

            let today = new Date();
            let threeDaysLater = new Date(today);
            threeDaysLater.setDate(today.getDate() + 3);

            let schedules = await db.LichTrinh.findAll({
                where: {
                    ngayHen: {
                        [Op.between]: [today.setHours(0, 0, 0, 0), threeDaysLater.setHours(23, 59, 59, 999)]
                    },
                    soLuongToiDa: {
                        [Op.gt]: db.Sequelize.literal("COALESCE(soLuongHienTai, 0)")
                    }
                },
                include: [
                    { model: db.QuyDinh, as: 'thoiGianData', attributes: ['giaTriVi'] },
                    { model: db.NguoiDung, as: 'bacSiData', attributes: ['ho', 'ten'] }
                ],
                raw: true,
                nest: true
            });

            let scheduleString = "HIỆN KHÔNG CÓ LỊCH KHÁM NÀO TRONG 3 NGÀY TỚI.";
            if (schedules && schedules.length > 0) {
                scheduleString = schedules.map(s => {
                    let dateStr = new Date(s.ngayHen).toLocaleDateString('vi-VN');
                    return `- Ngày ${dateStr}: Bác sĩ ${s.bacSiData.ho} ${s.bacSiData.ten} có ca khám lúc [${s.thoiGianData.giaTriVi}]`;
                }).join("\n");
            }

            const systemInstruction = getDetailedMedicalPrompt(specialtyString, doctorString);
            const finalInput = `${systemInstruction}\n\n--- HISTORY ---\n${historyContext}\n\n--- INPUT ---\n"${message}"`;

            let rawText = await callGeminiDirectly(finalInput);

            let aiResponse;
            try {
                let cleanJson = rawText.replace(/```json|```/g, '').trim();
                aiResponse = JSON.parse(cleanJson);
            } catch (e) {
                console.log("Lỗi parse JSON AI:", e);
                aiResponse = {
                    analysis: rawText,
                    advice: "",
                    specialtyId: null,
                    doctorName: "",
                    doctorId: null
                };
            }

            if (userId) {
                await db.LichSuChat.create({
                    maBenhNhan: userId,
                    noiDung: JSON.stringify(aiResponse),
                    laBot: true
                });
            }

            resolve({
                errCode: 0,
                ...aiResponse
            });

        } catch (e) {
            reject(e);
        }
    });
};

let getChatHistoryByUserService = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({ errCode: 1, message: "Missing userId" });
                return;
            }

            let history = await db.LichSuChat.findAll({
                where: { maBenhNhan: userId },
                order: [['createdAt', 'ASC']]
            });

            let data = history.map(item => {
                let text = item.noiDung;
                let analysis = "", advice = "", doctorName = "";
                let specialtyId = null, doctorId = null;

                if (item.laBot) {
                    try {
                        let json = JSON.parse(item.noiDung);
                        analysis = json.analysis;
                        advice = json.advice;
                        doctorName = json.doctorName;
                        specialtyId = json.specialtyId;
                        doctorId = json.doctorId;
                        text = "";
                    } catch (e) {
                        text = item.noiDung;
                    }
                }

                return {
                    text: text,
                    isBot: item.laBot,
                    analysis: analysis,
                    advice: advice,
                    doctorName: doctorName,
                    specialtyId: specialtyId,
                    doctorId: doctorId
                };
            });

            resolve({
                errCode: 0,
                data: data
            });

        } catch (e) {
            reject(e);
        }
    });
};

let getPatientChatSummaryService = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({ errCode: 1, message: "Thiếu mã bệnh nhân" });
                return;
            }

            let history = await db.LichSuChat.findAll({
                where: { maBenhNhan: patientId },
                order: [['createdAt', 'DESC']],
                limit: 20
            });

            if (!history || history.length === 0) {
                resolve({
                    errCode: 0,
                    data: { summary: "Bệnh nhân chưa có lịch sử trò chuyện.", fullChat: [] }
                });
                return;
            }

            let chronologicalHistory = history.reverse();
            let chatContentForAI = "";
            let fullChatData = [];

            chronologicalHistory.forEach(item => {
                let textContent = item.noiDung;
                if (item.laBot) {
                    try {
                        let json = JSON.parse(item.noiDung);
                        textContent = json.analysis || item.noiDung;
                    } catch (e) { }
                }
                chatContentForAI += `${item.laBot ? 'AI' : 'Bệnh nhân'}: ${textContent}\n`;
                fullChatData.push({
                    sender: item.laBot ? 'AI' : 'Bệnh nhân',
                    text: textContent,
                    time: item.createdAt
                });
            });

            const prompt = `
            Đóng vai trò là trợ lý y khoa chuyên nghiệp. Dựa vào đoạn hội thoại dưới đây giữa Bệnh nhân và AI, hãy viết một bản "Tóm tắt bệnh án sơ bộ" ngắn gọn (dưới 100 từ) cho Bác sĩ.
            Yêu cầu:
            - Chỉ liệt kê các triệu chứng chính, thời gian mắc bệnh, tiền sử bệnh (nếu có).
            - Bỏ qua các câu chào hỏi xã giao.
            - Giọng văn chuyên môn, súc tích.
            - Nếu không có thông tin bệnh lý, hãy trả lời "Không có thông tin y tế đáng chú ý".

            --- ĐOẠN HỘI THOẠI ---
            ${chatContentForAI}
            `;

            let aiSummaryRaw = await callGeminiDirectly(prompt);
            let summaryFinal = aiSummaryRaw;

            try {
                let parsedJson = JSON.parse(aiSummaryRaw);
                let keys = Object.keys(parsedJson);
                if (keys.length > 0) {
                    summaryFinal = parsedJson[keys[0]];
                }
            } catch (e) {
                console.log("AI returned plain text or invalid JSON for summary");
            }

            resolve({
                errCode: 0,
                data: {
                    summary: summaryFinal,
                    fullChat: fullChatData
                }
            });

        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleChatBotService,
    getChatHistoryByUserService,
    getPatientChatSummaryService
};