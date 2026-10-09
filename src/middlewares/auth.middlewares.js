const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "You don't have access to this resource. Artist role required." });
        }

        req.user = decoded
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};


async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "user" && decoded.role !== "artist"){
            return res.status(403).json({ message: "You don't have access to this resource. User or Artist role required." });
        }

        req.user = decoded
        next();
    }catch(err){
        console.error("Token verification error:", err);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}
module.exports = { authArtist , authUser};    