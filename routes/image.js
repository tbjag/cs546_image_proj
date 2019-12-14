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

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    console.log("HELLO");
    console.log(req.body.name);
    cb(null, req.body.name +  path.extname(file.originalname));
  }
});
 
var upload = multer({ storage: storage });

// @route GET /
// @desc Loads form
router.get("/", async function (req,res){
  //console.log("IMAGE");
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
  console.log("at image :post")
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database

  var finalImg = {
  contentType: req.file.mimetype,
  image:  new Buffer.from(encode_image, 'base64')
  };
  const data = await images();
  const insertInfo = await data.insertOne(finalImg);
  
  //console.log("ID: "+finalImg._id);
  const dude = await usersData.get(req.session.userId);
  await usersData.addImageTag(finalImg, dude._id, "image.jpg");

  //const pics = await imageData.getAll();
  //var imag = new Image(100,200);
  //imag.src = finalImg.image;
  //if (err) return console.log(err);
    //maybe redirect somewhere else??
  console.log('saved to database');
  //console.log(finalImg.image);
  res.render('layouts/upload', {pics: "image.jpg", title: "Files", logged:true, username: dude.firstName});
});

router.get("/all", async function (req,res){

});

//Call this when the user clicks "Comment" wherever that will be
//If we get spooked we can change this to comment1, comment2, ...comment5 where we only post 5 images on the feed
router.post("/comment", async function (req,res){
  const comment = await comments();
  const commenter = await usersData.get(req.session.userId);
  await commentData.addComment(req.body, commenter._id);//Need to get imageID here
  res.render('layouts/home', {comment: req.body, commenter: commenter.firstName+" "+commenter.lastName});
});

  


module.exports = router;