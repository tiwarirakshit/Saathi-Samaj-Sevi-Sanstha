const express = require('express');
const router = express.Router();
var multer = require('multer');
const path = require('path')
const passport = require('passport');
require("../controller/passportlocal")(passport);
const csrf = require("csurf");

router.use(csrf());

const uploadPath = path.join(__dirname, "../../public/uploads");

// image upload
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, cb) {
        cb(null, 'Image' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var validextension = ['.png', '.jpg', '.JPG', 'JPEG', '.jpeg'];
        var ext = path.extname(file.originalname);
        if (!validextension.includes(ext)) {
            return cb(new Error("please choose .png,.jpg of .jpeg files !"));
        }
        cb(null, true)
    },
    limits: { fileSize: 125000 * 1000 },
}).single('file');


const {
    home,
    about,
    getStoryById,
    gallery,
    getAbout,
    contact,
    contactUser,
    getLogin,
    getSignup,
    getGallery,
    getBlog,
    addImage,
    addBlog,
    editImage,
    editBlog,
    signUp,
    Login,
    Logout,
    getEmails,
    uploadImage,
    deleteImage,
    editGallery,
    uploadBlog,
    deleteBlog,
    editBlogData,
    getAnnualReports,
    getNetworkAndPartner,
    getOurApproach,
    getOurProjects,
    getStory,
    getBlogById
} = require('../controller/homeController');


//* admin authentication 
const checkAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == 'admin') {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();

    } else {
        req.flash('error_messages', "Please Login to continue !");
        res.render('login', { csrfToken: req.csrfToken(), error: "Please Login to continue !" });
    }
}


//  home controller
router.get('/', home);

//  about get controller
router.get('/about', about);
//  gallery get controller
router.get('/gallery', gallery);
//  about get controller
router.get('/about', getAbout);
//  contact get controller
router.get('/contact', contact);
//single story page
router.get('/getStoryById/:id', getStoryById);


//  contact post  controller
router.post('/contactUser', contactUser);


// admin controller

//  login get controller
router.get('/getLogin', getLogin);
//  Signup get controller
router.get('/getSignup', getSignup);
//  gallery get controller
router.get('/getGallery', checkAuth, getGallery);
//  Blog get controller
router.get('/getBlog', checkAuth, getBlog);
// add Image get controller
router.get('/addImage', checkAuth, addImage);
// add Blog get controller
router.get('/addBlog', checkAuth, addBlog);
// edit Image get controller
router.get('/editImage/:id', checkAuth, editImage);
// edit Blog get controller
router.get('/editBlog/:id', checkAuth, editBlog);
// logout get controller
router.get('/Logout', checkAuth, Logout);
// emails get controller
router.get('/getEmails', checkAuth, getEmails);
//delete image get controller
router.get('/deleteImage/:id', checkAuth, deleteImage);
//delete Blog get controller
router.get('/deleteBlog/:id', checkAuth, deleteBlog)
// annual reports get controller
router.get('/AnnualReports', getAnnualReports)
// network and partner get controller
router.get('/network&Partner', getNetworkAndPartner)
// our approach get controller
router.get('/OurApproach', getOurApproach)
// our projects get controller
router.get('/OurProjects', getOurProjects)
// story get controller
router.get('/story', getStory);
// single story get controller
router.get('/single-story/:id', getBlogById);

//  sign up post controller
router.post('/signUp', signUp);
//  login post controller
router.post('/Login', Login);
//  upload image post controller
router.post('/uploadImage', upload, uploadImage);
// edit gallery post controller
router.post('/editGallery', upload, editGallery)
// upload Blogs post controller
router.post('/uploadBlog', upload, uploadBlog)
// edit Blogs post controller
router.post('/editBlogData', checkAuth, upload, editBlogData);

// export routes
module.exports = router;
