import { json } from "body-parser";
import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    let data = await db.NguoiDung.findAll();
    return res.render('homePage.ejs', { data: JSON.stringify(data) });
}

let displayCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let getCRUD = async (req, res) => {
    let duLieu = await CRUDService.layNguoiDung();
    return res.render('displayCRUD.ejs', { duLieu: duLieu });
}
let postCRUD = async (req, res) => {
    let thongBao = await CRUDService.taoNguoiDung(req.body);
    return res.send(thongBao);
}

let getEditCRUD = async (req, res) => {
    let maNguoiDung = req.query.id;
    if (maNguoiDung) {
        let nguoiDung = await CRUDService.layNguoiDungTheoMa(maNguoiDung);
        return res.render("editCRUD.ejs", { nguoiDung: nguoiDung })
    } else {
        return res.send("Không tìm thấy người dùng!");
    }
}

let putCRUD = async (req, res) => {
    let duLieu = req.body;
    await CRUDService.capNhatNguoiDung(duLieu);
    return res.redirect("/get-crud");
}

let deleteCRUD = async (req, res) => {
    let maNguoiDung = req.query.id;
    if (maNguoiDung) {
        await CRUDService.xoaNguoiDung(maNguoiDung);
        return res.redirect("/get-crud");
    } else {
        return res.send("Không tìm thấy người dùng!");
    }
}
module.exports = {
    getHomePage: getHomePage,
    displayCRUD: displayCRUD,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}