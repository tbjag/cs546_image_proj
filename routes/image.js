const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const imageData = data.images;
const commentData = data.comments;
const mongoCollections = require("../data/collections");
const users = mongoCollections.users;
const images = mongoCollections.images;
const comments = mongoCollections.comments;
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');


// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, "image" +  path.extname(file.originalname));
  }
});
 
var upload = multer({ storage: storage });

// @route GET /
// @desc Loads form
router.get("/", async function (req,res){
  if(req.session.userId){
  try{
    if(req.session.userId){
      const profile = await usersData.get(req.session.userId);
      res.render("layouts/upload", {logged:true, username: profile.firstName});
      return;
    }else{
      res.render("layouts/upload", {title: "Files", logged:false});
      return;
    }
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
}else{
  res.render("layouts/upload", {logged:false});
}
});

router.post('/', upload.single('image'), async (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database
  let h = req.body.desc;
  
  var finalImg = {
    contentType: req.file.mimetype,
    image:  new Buffer.from(encode_image, 'base64'),
    name: req.body.name,
    description: req.body.desc,
    filepath: "public/images/" + req.session.userId + req.body.name + ".jpg"
  };

  var changeName = await jimp.read("public/images/image.jpg");
  changeName.write(finalImg.filepath);

  const data = await images();
  const insertInfo = await data.insertOne(finalImg);

  var fileName = req.body.name;
  //console.log(req.session.userId);
  const dude = await usersData.get(req.session.userId);
  await usersData.addImageTag(finalImg, dude._id, fileName);

  console.log('saved to database');
  res.render('layouts/upload', {pics: "image.jpg", title: "Files", logged:true, username: dude.firstName});
});

router.get("/all", async function (req,res){

});

//Call this when the user clicks "Comment"
router.post("/:id/comment", async function (req,res){
  let arr = await imageData.get(req.params.id);
  const commenter = await usersData.get(req.session.userId);
  await commentData.addComment(req.body.comment, commenter._id, arr._id);
  var allComments = await commentData.getAll();
  var all = allComments.filter((value)=>{
     return value.imageID == req.params.id;
  })
  if(req.session.userId){
    res.render('layouts/image', {logged: true, comments: all, username: commenter.firstName, id: arr._id, url: arr.filepath});
  }else{
    res.render('layouts/image', {logged: false, username: commenter.firstName});
  }
});

router.get("/:id", async function (req,res){
  let arr = await imageData.get(req.params.id);
  if(req.session.userId){
    const dude = await usersData.get(req.session.userId);
    var allComments = await commentData.getAll();
    var all = allComments.filter((value)=>{
      return value.imageID == req.params.id;
   })
    res.render("layouts/image", {username:dude.firstName, logged: true, url: arr.filepath, id: arr._id, comments: all});
  }else{
    res.render("layouts/image", {logged: false, url: arr.filepath});
  }
});

module.exports = router;