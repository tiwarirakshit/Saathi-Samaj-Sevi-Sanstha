const express = require("express");
const contactModel = require("../models/contact");
const nodemailer = require('nodemailer');
const bcryptjs = require("bcryptjs");
const passportAdmin = require("passport");
require("./passportlocal")(passportAdmin);
const userAdmin = require("../models/admin");
const galleryModel = require("../models/gallery");
const blogModel = require("../models/blog")

const authorization = {
  service: 'gmail',
  secure: 'true',
  auth: {
    user: process.env.mailId,  //your email address
    pass: process.env.password  // your password
  }
};


// home get method
const home = (req, res) => {
  res.render("index", { title: "home" });
}

// about get method
const about = async (req, res) => {
  res.render('about', { title: "about" })
}

// gallery get method
const gallery = async (req, res) => {
  try {
    const ImageData = await galleryModel.find({});
    res.render('gallery', { title: "Gallery", Image: ImageData });
  }
  catch (err) {
    res.status(500).send(err);
    return;
  }
}


// about get method
const getAbout = (req, res) => {
  res.render('about', { title: 'About' });
}

const getStoryById = async (req, res) => {
  const id = req.params.id;
  const story = await blogModel.findById(id);
  console.log(story);
  if (story == null) {
    res.redirect('/');
  }
  else {
    res.render('story', { title: "story", story: story });
  }
}

// contact get method
const contact = (req, res) => {
  res.render('contact', { title: 'Contact', csrfToken: req.csrfToken() });
}

// contact post method
const contactUser = async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;
    if (!email || !name || !mobile || !subject || !message) {
      res.render("contact", {
        err: "All Fields Required !"
      });
    }
    else {
      let userData = new contactModel({
        name,
        email,
        mobile,
        subject,
        message
      });
      const newUser = await userData.save()
      // const transporter = nodemailer.createTransport(authorization);
      // const mailOptions = {
      //   from: req.body.email,
      //   to: `${process.env.mailId}`,
      //   subject: subject,
      //   text: `${req.body.name} ${req.body.email} ${req.body.phone} ${req.body.message}`,
      // }
      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     res.status(400).render('404');
      //   } else {
      //     console.log("info", info)
      //     res.status(200).render('contact', { msg: 'email send successful' });
      //     return;
      //   }
      // });

      if (!!newUser) {
        res.status(200).render('contact', { msg: 'email send successful' });
      }
      else {
        res.status(400).render('404');
      }
    }
  }
  catch (err) {
    res.status(400).render('404');
    return;
  }
}


// login get method
const getLogin = (req, res) => {
  res.render('login', { title: 'login', csrfToken: req.csrfToken() });
}

// register get method
const getSignup = (req, res) => {
  res.render('register', { title: 'register', csrfToken: req.csrfToken() });
}

// gallery get method
const getGallery = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const ImageData = await galleryModel.find({});
      res.render("galleryList", { title: "Gallery List", logged: true, user: req.user, csrfToken: req.csrfToken(), Image: ImageData });
    }
    catch (err) {
      res.status(400).send(err)
    }
  } else {
    res.render('galleryList', { title: 'Gallery List', logged: false });
  }
}

// add gallery get method
const addImage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addImage", { title: "Add Image", logged: true, user: req.user, csrfToken: req.csrfToken(), op: "uploadImage" });
  } else {
    res.render('addImage', { title: 'Add Image', logged: false });
  }
}

// edit gallery get method
const editImage = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Id = req.params.id;
      const ImageData = await galleryModel.findById({ _id: Id });
      res.render("addImage", { title: "Edit Image", logged: true, user: req.user, csrfToken: req.csrfToken(), Image: ImageData, op: "editGallery", warning: true });
    }
    catch (err) {
      res.status(404).send(err)
    }
  } else {
    res.render('addImage', { title: 'Edit Image', logged: false });
  }
}

// blog get method
const getBlog = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      let blogData = await blogModel.find({});
      res.render("blogList", { title: "  blog", logged: true, user: req.user, csrfToken: req.csrfToken(), blog: blogData })
    }
    catch (err) {
      throw new err;
    }
  } else {
    res.render('blogList', { title: ' blog', logged: false });
  }
}

// add blog get method
const addBlog = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addBlog", { title: "Add blog", op: "uploadBlog", logged: true, user: req.user, csrfToken: req.csrfToken() });
  } else {
    res.render('addBlog', { title: 'Add blog', logged: false });
  }
}

// edit blog get method
const editBlog = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Id = req.params.id;
      const blogData = await blogModel.findById({ _id: Id });
      res.render("addBlog", { title: "Edit blog", logged: true, user: req.user, csrfToken: req.csrfToken(), blog: blogData, op: "editBlogData" });
    }
    catch (err) {
      res.status(404).send(err)
    }
  } else {
    res.render('addBlog', { title: 'Edit blog', logged: false });
  }
}


// emails get method
const getEmails = async (req, res) => {
  if (req.isAuthenticated()) {
    const data = await contactModel.find({});
    if (data != null) {
      res.render("emails", { title: "Emails", logged: true, user: req.user, emailData: data, csrfToken: req.csrfToken() });
    }
    else {
      res.render("emails", { title: "Emails", logged: true, user: req.user, emailData: null, csrfToken: req.csrfToken() });

    }
  } else {
    res.render('emails', { title: 'gallery', logged: false });
  }
}

// signup  post method
const signUp = (req, res) => {
  try {
    // get all the values
    const { email, username, password, confirmpassword } = req.body;
    // check if the are empty
    if (!email || !username || !password || !confirmpassword) {
      res.render("signup", {
        err: "All Fields Required !",
        csrfToken: req.csrfToken(),
      });
    } else if (password != confirmpassword) {
      res.render("register", {
        err: "Password Don't Match !",
        csrfToken: req.csrfToken(),
      });
    } else {
      // validate email and username and password
      // skipping validation
      // check if a user exists
      userAdmin.findOne(
        { $or: [{ email: email }, { username: username }] },
        function (err, data) {
          if (err) throw err;
          if (data) {
            res.render("register", {
              err: "User Exists, Try Logging In !",
              csrfToken: req.csrfToken(),
            });
          } else {
            // generate a salt
            bcryptjs.genSalt(12, (err, salt) => {
              if (err) throw err;
              // hash the password
              bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                // save user in db
                userAdmin({
                  username: username,
                  email: email,
                  password: hash,
                  googleId: null,
                  provider: 'email',
                }).save((err, data) => {
                  if (err) throw err;
                  // login the user
                  // use req.login
                  // redirect , if you don't want to login
                  res.redirect("/getLogin");
                });
              });
            });
          }
        }
      );
    }
  } catch (err) {
    res.status(500).send(err);
    return;
  }
};


// login  get method
const Login = (req, res, next) => {
  passportAdmin.authenticate("local", {
    failureRedirect: "getLogin",
    successRedirect: "/getGallery",
    failureFlash: true,
    logged: true,
    user: req.user,
  })(req, res, next);
};

//  logout get method
const Logout = (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    res.redirect("/getLogin");
  });
};

// upload image post method
const uploadImage = async (req, res) => {
  try {
    if (!!req.file === false) {
      res.render("addImage", {
        err: "Image is required !",
        logged: true,
        csrfToken: req.csrfToken(),
        user: req.user,
      });
      return;
    }

    const image = req.file.filename;

    const galleries = new galleryModel({
      image,
    });

    let result = await galleries.save();


    if (!!result) {
      res.status(201).render("addImage", {
        csrfToken: req.csrfToken(),
        logged: true,
        msg: "Image added successfully!",
      });
      return;
    }
    else {
      res.status(400).render("addImage", {
        csrfToken: req.csrfToken(),
        logged: true,
        err: "Image upload failed !",
      });
      return;
    }

  }
  catch (err) {
    res.status(500).send(err);
    return;
  }
}

// delete image get method
const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    galleryModel.findByIdAndRemove(id, (err, doc) => {
      if (!err) {
        res.redirect('back');
        return;
      }
      else {
        res.status(500).send(err);
        return;
      }
    })
  }
  catch (err) {
    res.status(500).send(err);
    return;

  }
}

// edit gallery post method
const editGallery = async (req, res) => {
  try {
    const id = req.body.id;
    const ImageData = await galleryModel.findById({ _id: id });
    const galleries = {
      image: req.file.filename
    }
    galleryModel.findByIdAndUpdate(id, galleries, { new: true }, (err, docs) => {
      if (!err) {
        res.status(201).render("addImage", {
          logged: true,
          Image: docs,
          msg: "image updated successfully!",
          csrfToken: req.csrfToken(),
          user: req.user,
        });
        return;
      }
      else {
        res.render("addImage", {
          err: "Something wrong when updating image !",
          logged: true,
          Image: ImageData,
          csrfToken: req.csrfToken(),
          user: req.user,
        });
        return;
      }
    });

  }
  catch (err) {
    res.status(404).send(err);
    return;
  }
}

// upload blog post method 
const uploadBlog = async (req, res) => {
  try {
    const { title, description, author } = req.body;

    if (!!req.file === false) {
      res.render("addBlog", {
        err: "Image is required !",
        logged: true,
        csrfToken: req.csrfToken(),
        user: req.user,
      });
      return;
    }
    if (!title || !description || !author) {
      res.render("addBlog", {
        err: "All Fields Required !",
        logged: true,
        csrfToken: req.csrfToken(),
        user: req.user,
      });
      return;
    } else {
      const image = req.file.filename;
      // validate blog if already present in the database
      blogModel.findOne(
        { $or: [{ title: title }, { description: description }] },
        async function (err, data) {
          if (err) throw err;
          if (data) {
            res.render("addBlog", {
              err: "blog Exists, add another one !",
              csrfToken: req.csrfToken(),
              logged: true,
              user: req.user,
            });
          } else {
            const blogs = new blogModel({
              title,
              description,
              author,
              image,
            });
            let result = await blogs.save();

            if (!!result) {
              res.status(201).render("addBlog", {
                csrfToken: req.csrfToken(),
                logged: true,
                msg: "blog added successfully!",
              });
            }
            else {
              res.status(400).render("addBlog", {
                csrfToken: req.csrfToken(),
                logged: true,
                err: "blog upload failed !",
              });
            }
          }
        }
      );
    }
  }
  catch (err) {
    res.status(500).send(err);
    return;
  }

}

// delete blog get method
const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    blogModel.findByIdAndRemove(id, (err, doc) => {
      if (!err) {
        res.redirect('back');
        return;
      }
      else {
        res.status(500).send(err);
        return;
      }
    })
  }
  catch (err) {
    res.status(500).send(err);
    return;
  }

}

// edit blogs post method
const editBlogData = async (req, res) => {
  try {
    const id = req.body.id;
    const blogData = await galleryModel.findById({ _id: id });
    const blogs = {
      name: req.body.name,
      message: req.body.message,
      date: req.body.date
    }
    blogModel.findByIdAndUpdate(id, blogs, { new: true }, (err, docs) => {
      if (!err) {
        res.status(201).render("addBlog", {
          logged: true,
          blog: docs,
          msg: "blog updated successfully!",
          csrfToken: req.csrfToken(),
          user: req.user,
        });
      }
      else {
        res.render("addBlog", {
          err: "Something wrong when updating blog !",
          logged: true,
          blog: blogData,
          csrfToken: req.csrfToken(),
          user: req.user,
        });
      }
    });

  }
  catch (err) {
    res.status(404).send(err);
    return;
  }

}


// annual reports get method
const getAnnualReports = (req, res) => {
  res.render('annualReports', { title: 'Annual Reports' });
}

// network & Partner get method
const getNetworkAndPartner = (req, res) => {
  res.render('networkAndPartner', { title: 'Network & Partner' });
}

//our Approach get method
const getOurApproach = (req, res) => {
  res.render('ourApproach', { title: 'Our Approach' });
}

//our Projects get method
const getOurProjects = (req, res) => {
  res.render('ourProjects', { title: 'Our Projects' });
}

//Stories Single Page get method
const getSingleStory = (req, res) => {
  res.render('stories', { title: 'Blog' });
}


// story get method
const getStory = async (req, res) => {
  const data = await blogModel.find({});
  if (data.length > 0) {
    res.render('stories', { title: 'Story', blogs: data });
  }
  else {
    res.render('stories', { title: 'Story', blogs: [] });
  }
}



// get blog by Id get method
const getBlogById = async (req, res) => {
  try {
    const Id = req.params.id;
    let blogData = await blogModel.findById({ _Id: new ObjectId(Id) });
    if (!!blogData) {
      res.render("singleStory", { title: "Story", blog: blogData })
    }
    else {
      const data = await blogModel.find({});
      res.render('story', { title: 'Story', blogs: data });
    }
  }
  catch (err) {
    throw new err;
  }
}

module.exports = {
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
};
