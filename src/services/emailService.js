import Brevo from '@getbrevo/brevo';
require('dotenv').config();

const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const SENDER_EMAIL = process.env.SENDER_EMAIL || process.env.EMAIL_APP;
const SENDER_NAME = process.env.SENDER_NAME || "Bệnh viện Bình Dân Đà Nẵng";

let sendSimpleEmail = async (dataSend) => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🔔 XÁC NHẬN LỊCH ĐẶT KHÁM BỆNH - BỆNH VIỆN BÌNH DÂN";
    sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: #007f5f; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase;">BỆNH VIỆN BÌNH DÂN ĐÀ NẴNG</h2>
            <p style="color: #e0e0e0; margin: 5px 0 0; font-size: 14px;">Chăm sóc sức khỏe toàn diện</p>
        </div>

        <div style="padding: 30px 20px; background-color: #ffffff;">
            <p>Xin chào <b>${dataSend.patientName}</b>,</p>
            <p>Bạn nhận được email này vì đã thực hiện đặt lịch khám bệnh trực tuyến tại Bệnh viện Bình Dân Đà Nẵng.</p>
            
            <p style="margin-top: 20px; font-weight: bold; color: #007f5f;">Thông tin lịch hẹn chi tiết:</p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #007f5f; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><b>🕒 Thời gian:</b> ${dataSend.time}</p>
                <p style="margin: 5px 0;"><b>👨‍⚕️ Bác sĩ phụ trách:</b> ${dataSend.doctorName}</p>
                <p style="margin: 5px 0;"><b>🏥 Địa điểm:</b> 376 Trần Cao Vân, Thanh Khê, Đà Nẵng</p>
                <p style="margin: 5px 0;"><b>💰 Phí đặt lịch:</b> Miễn phí</p>
            </div>

            <p>Nếu thông tin trên là chính xác, vui lòng nhấn vào nút bên dưới để <b>Xác nhận</b> và hoàn tất thủ tục đặt lịch.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${dataSend.redirectLink}" target="_blank" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Xác nhận lịch hẹn ngay
                </a>
            </div>
            
            <p style="font-size: 13px; color: #666; font-style: italic;">
                * Lưu ý: Link xác nhận này chỉ có hiệu lực trong vòng 24 giờ. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
            </p>
        </div>

        <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">
            <p style="margin: 5px 0;"><b>BỆNH VIỆN ĐA KHOA BÌNH DÂN ĐÀ NẴNG</b></p>
            <p style="margin: 5px 0;">Địa chỉ: 376 Trần Cao Vân, Xuân Hà, Thanh Khê, Đà Nẵng</p>
            <p style="margin: 5px 0;">Hotline: 0236.3714.030 - Email: tuvan@binhdanospital.vn</p>
            <p style="margin: 10px 0 0;">&copy; 2025 Binh Dan Hospital. All rights reserved.</p>
        </div>
    </div>
    `;
    sendSmtpEmail.sender = { "name": SENDER_NAME, "email": SENDER_EMAIL };
    sendSmtpEmail.to = [{ "email": dataSend.receiverEmail, "name": dataSend.patientName }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

let sendAttachment = async (dataSend) => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "KẾT QUẢ KHÁM BỆNH & HÓA ĐƠN";
    sendSmtpEmail.htmlContent = `
    <div style="background-color: #f4f7f6; font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background-color: #28a745; padding: 20px; text-align: center;">
                 <h2 style="color: white; margin: 0;">KẾT QUẢ KHÁM BỆNH</h2>
            </div>
            <div style="padding: 20px;">
                <p>Xin chào <b>${dataSend.patientName}</b>,</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của Bệnh viện Bình Dân.</p>
                <p>Chúng tôi xin gửi kèm hóa đơn/đơn thuốc trong file đính kèm dưới đây.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <p style="margin: 5px 0;"><b>Bác sĩ phụ trách:</b> ${dataSend.doctorName || 'Bác sĩ chuyên khoa'}</p>
                    <p style="margin: 10px 0 5px;"><b>Lời dặn của bác sĩ:</b></p>
                    <p style="margin: 0; color: #333; font-style: italic;">
                        ${dataSend.description ? dataSend.description : 'Không có lời dặn thêm.'}
                    </p>

                </div>
                <p>Chúc bạn thật nhiều sức khỏe!</p>
            </div>
             <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px;">
                <p>&copy; 2025 Binh Dan Hospital</p>
            </div>
        </div>
    </div>
    `;
    sendSmtpEmail.sender = { "name": SENDER_NAME, "email": SENDER_EMAIL };
    sendSmtpEmail.to = [{ "email": dataSend.email, "name": dataSend.patientName }];

    // Attachment
    sendSmtpEmail.attachment = [{
        name: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split("base64,")[1]
    }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email with attachment sent successfully');
    } catch (error) {
        console.error('Error sending email with attachment:', error);
    }
}

let sendCancelEmail = async (dataSend) => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "⚠️ XÁC THỰC YÊU CẦU HỦY LỊCH HẸN";
    sendSmtpEmail.htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <div style="background-color: #fff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #ff8787;">
                <h2 style="color: #2d3436; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">YÊU CẦU HỦY LỊCH HẸN</h2>
                <p style="color: #636e72; margin: 5px 0 0; font-size: 14px;">Bệnh viện Bình Dân Đà Nẵng</p>
            </div>

            <div style="padding: 30px 40px;">
                <p style="font-size: 16px; color: #2d3436; margin-bottom: 20px;">Xin chào <b>${dataSend.patientName}</b>,</p>
                
                <p style="color: #636e72; line-height: 1.6;">
                    Chúng tôi vừa nhận được yêu cầu hủy lịch khám bệnh của bạn. Để đảm bảo đây là thao tác chính chủ, vui lòng kiểm tra lại thông tin bên dưới:
                </p>
                
                <div style="background-color: #fff5f5; border: 1px dashed #ff8787; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <table style="width: 100%;">
                        <tr>
                            <td style="padding: 5px 0; color: #868e96; width: 120px;">Thời gian:</td>
                            <td style="padding: 5px 0; color: #2d3436; font-weight: 600;">${dataSend.time}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #868e96;">Bác sĩ:</td>
                            <td style="padding: 5px 0; color: #2d3436; font-weight: 600;">${dataSend.doctorName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #868e96;">Trạng thái:</td>
                            <td style="padding: 5px 0; color: #ff8787; font-weight: bold;">Đang chờ hủy...</td>
                        </tr>
                    </table>
                </div>

                <p style="color: #636e72; line-height: 1.6; margin-bottom: 30px;">
                    Nếu bạn chắc chắn muốn hủy lịch hẹn này, hãy nhấn vào nút bên dưới. <br>
                    <i>Lưu ý: Hành động này không thể hoàn tác.</i>
                </p>

                <div style="text-align: center; margin-bottom: 20px;">
                    <a href="${dataSend.redirectLink}" target="_blank" 
                       style="background-color:rgb(247, 109, 109); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(250, 82, 82, 0.3); transition: all 0.3s;">
                        🚫 Xác nhận Hủy Lịch
                    </a>
                </div>
                
                <div style="text-align: center;">
                    <p style="font-size: 13px; color: #adb5bd;">Nếu bạn không yêu cầu hủy, vui lòng bỏ qua email này.</p>
                </div>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #adb5bd; border-top: 1px solid #f1f3f5;">
                <p style="margin: 0;">&copy; 2025 Binh Dan Hospital. Hotline: 0236.3714.030</p>
            </div>
        </div>
    </div>
    `;
    sendSmtpEmail.sender = { "name": SENDER_NAME, "email": SENDER_EMAIL };
    sendSmtpEmail.to = [{ "email": dataSend.receiverEmail, "name": dataSend.patientName }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Cancel email sent successfully');
    } catch (error) {
        console.error('Error sending cancel email:', error);
    }
}

const sendForgotPasswordEmail = async (dataSend) => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🔒 ĐẶT LẠI MẬT KHẨU - BỆNH VIỆN BÌNH DÂN";
    sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <div style="background-color: #ffc107; padding: 20px; text-align: center;">
                <h2 style="color: #333; margin: 0; text-transform: uppercase;">YÊU CẦU ĐẶT LẠI MẬT KHẨU</h2>
            </div>
            
            <div style="padding: 30px;">
                <p>Xin chào,</p>
                <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản: <b>${dataSend.receiverEmail}</b></p>
                <p>Để đặt lại mật khẩu của bạn, vui lòng nhấp vào nút bên dưới:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${dataSend.redirectLink}" target="_blank" 
                       style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Đặt lại mật khẩu
                    </a>
                </div>
                
                <p>Link này sẽ hết hạn sau thời gian ngắn để đảm bảo an toàn.</p>
                <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
            </div>

            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                <p>&copy; 2025 Binh Dan Hospital</p>
            </div>
        </div>
    </div>
    `;
    sendSmtpEmail.sender = { "name": SENDER_NAME, "email": SENDER_EMAIL };
    sendSmtpEmail.to = [{ "email": dataSend.receiverEmail }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Forgot password email sent successfully');
    } catch (error) {
        console.error('Error sending forgot password email:', error);
    }
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    sendCancelEmail: sendCancelEmail,
    sendForgotPasswordEmail: sendForgotPasswordEmail
}