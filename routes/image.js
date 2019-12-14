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
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database
  console.log("File Desc: "+ req.body.desc);
  console.log("File Desc: "+req.body.name);
  var finalImg = {
    contentType: req.file.mimetype,
    image:  new Buffer.from(encode_image, 'base64'),
    name: req.body.name,
    description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
    filepath: "public/images/" + req.session.userId + req.body.name + ".jpg"
  };

  var changeName = await jimp.read("public/images/image.jpg");
  changeName.write(finalImg.filepath);

  const data = await images();
  const insertInfo = await data.insertOne(finalImg);

  var fileName = req.body.name;
  console.log(req.session.userId);
  const dude = await usersData.get(req.session.userId);
  await usersData.addImageTag(finalImg, dude._id, fileName);

  console.log('saved to database');
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