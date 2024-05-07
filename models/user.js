
const { createHmac, randomBytes } = require('crypto');
const {Schema, model} = require('mongoose');
const { createToken } = require('../services/authentication');


const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/user.jpg",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
});

userSchema.pre("save", function (next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = "balu";
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
})

userSchema.static("matchPasswordAndGenerateToken", async function (email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest("hex");
    
    if(userProvidedHash !== hashedPassword) throw new Error("Invalid password");

    const token = createToken(user);
    return token;
})

const User = model("User", userSchema);

module.exports = User;