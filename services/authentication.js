const JWT = require("jsonwebtoken");

const secret = "balupal";

function createToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        fullname: user.fullname
    }

    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token , secret);
    return payload;
}

module.exports = {
    createToken,
    validateToken,
}