import jwt from "jsonwebtoken";

const JWT_SECRET = "BENHVIEN_BINHDAN_SECRET_123";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({
            message: "Thiếu token!"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Token không hợp lệ hoặc hết hạn!"
            });
        }

        req.user = decoded;
        next();
    });
};
module.exports = verifyToken

