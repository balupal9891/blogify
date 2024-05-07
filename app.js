require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require('./middlewares/auth');


const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("Mongodb Connected"));

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require('./models/blog');

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use("/user", userRoute);
app.use("/blog", blogRoute);



app.get("/", async (req, res)=>{
    const allBlogs = await Blog.find({
        owner: req.user?._id
    });
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
})


app.listen(PORT, ()=> console.log(`server started at PORT : ${PORT}`));
