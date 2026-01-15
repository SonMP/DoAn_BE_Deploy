import db Ô thay thế(Replace): from "../models/index.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import doctorsData from "../utils/bacsi.json.js";

const salt = bcrypt.genSaltSync(10);

const positionMap = {
    "BS": "P0",
    "BSCKI": "P0",
    "ThS.BS": "P1",
    "TS.BS": "P2",
    "PGS.TS": "P3",
    "GS.TS": "P4"
};

const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

const urlToBase64 = async (url) => {
    try {
        let response = await axios.get(url, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(response.data);

        let resizedBuffer = await sharp(buffer)
            .resize(800, 800, {
                fit: 'inside'
            })
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toBuffer();

        let finalBase64 = resizedBuffer.toString('base64');
        return `data:image/jpeg;base64,${finalBase64}`;

    } catch (e) {
        console.log("Lỗi xử lý ảnh: " + url);
        return "";
    }
}

let bulkCreateDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await bcrypt.hashSync("123456", salt);
            console.log(">>> [SEEDER] BẮT ĐẦU IMPORT BÁC SĨ...");

            let count = 0;
            for (let i = 0; i < doctorsData.length; i++) {
                let item = doctorsData[i];
                let emailGen = removeVietnameseTones(item.ten + item.ho).toLowerCase().replace(/\s/g, '') + i + "@binhdan.com";

                let check = await db.NguoiDung.findOne({ where: { email: emailGen } });
                if (check) continue;

                let base64Image = await urlToBase64(item.anh);

                await db.NguoiDung.create({
                    email: emailGen,
                    matKhau: hashPasswordFromBcrypt,
                    ten: item.ten,
                    ho: item.ho,
                    diaChi: "Bệnh viện Bình Dân Đà Nẵng",
                    soDienThoai: "0123456789",
                    gioiTinh: "M",
                    maVaiTro: "R2",
                    maViTri: positionMap[item.viTri] || "P0",
                    hinhAnh: base64Image,
                });
                count++;
                console.log(`---> Đã thêm: ${item.ho} ${item.ten}`);
            }
            resolve(`OK! Đã import thành công ${count} bác sĩ.`);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    bulkCreateDoctors: bulkCreateDoctors
};