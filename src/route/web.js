import express from "express";
import homeController from "../controllers/homeController.js";
import userController from "../controllers/userController.js";
import doctorController from "../controllers/doctorController.js";
import patientController from "../controllers/patientController.js";
import specialtyController from "../controllers/specialtyController.js";
import chatbotController from "../controllers/chatbotController.js";
import statisticalController from "../controllers/statisticalController.js";

import verifyToken from "../middleware/authMiddleware.js";

let router = express.Router();

let initWebRoutes = (app) => {

    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.displayCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.getCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post('/api/patient-sign-up', userController.handlePatientSignUp);
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", verifyToken, userController.handleCreateNewUser);
    router.put("/api/edit-user", verifyToken, userController.handleEditUser);
    router.delete("/api/delete-user", verifyToken, userController.handleDeleteUser);
    router.get("/api/get-quydinh", userController.getQuyDinh);
    router.get("/api/get-doctors", userController.getDoctorHome);
    router.get('/api/seed-doctors', userController.handleSeedData);

    router.post('/api/save-infor-doctors', doctorController.postInforDoctor);
    router.get('/api/get-all-doctors', doctorController.handleGetAllDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-schedule-dates', doctorController.getScheduleDates);
    router.put('/api/update-doctor-profile', doctorController.handleUpdateDoctorProfile);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);
    router.post('/api/bulk-create-schedule-week', doctorController.bulkCreateScheduleForWeek);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
    router.get('/api/get-history-by-patient-id', patientController.getHistoryByPatientId);
    router.get('/api/get-patient-booking-by-email', patientController.getBookingByEmail);
    router.post('/api/patient-request-cancel-booking', patientController.postVerifyCancelBooking);
    router.post('/api/verify-cancel-booking', patientController.verifyCancelBooking);

    router.get('/api/get-all-specialties', specialtyController.getAllSpecialty);
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.put('/api/edit-specialty', specialtyController.updateSpecialty);
    router.delete('/api/delete-specialty', specialtyController.deleteSpecialty);

    router.post('/api/chat-bot', chatbotController.handleChatBot);
    router.get('/api/get-chat-history', chatbotController.getChatHistoryByUser);
    router.get('/api/get-patient-chat-summary', chatbotController.getPatientChatSummary);

    router.get('/api/get-admin-dashboard', statisticalController.getAdminDashboardStats);

    return app.use("/", router);
}

module.exports = initWebRoutes;