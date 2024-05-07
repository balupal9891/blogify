const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { uploadOnCloudinary } = require('../utils/cloudinary');

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images/`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/add-new', (req,res)=>{
    return res.render("addBlog", {
        user: req.user
    })
})

router.get('/:id', async (req, res)=>{
    const blog = await Blog.findById(req.params?.id).populate('owner');
    const comments = await Comment.find({ blogId: req.params.id }).populate('owner');
    // console.log(blog)
    return res.render('blog', {
        user: req.user,
        blog,
        comments
    })
})

router.post('/comment/:blogId', async (req, res)=>{
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params?.blogId,
        owner: req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})

router.post('/', upload.single('coverImage') ,async (req,res)=>{
    const {title , content } = req.body;

    const localFilePath = req.file?.path;
    // console.log(localFilePath)
    const blogFile = await uploadOnCloudinary(localFilePath);
    // console.log(blogFile)

    if(!blogFile){
        throw new Error("Error while upoading blog image on cloudinary");
    }

    const blog = await Blog.create({
        title,
        content,
        owner: req.user._id,
        coverImage: blogFile?.url,
    });
    return res.redirect("/");
})

module.exports = router;
