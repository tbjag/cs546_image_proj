const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const mongoCollections = require("../data/collections");
const users = mongoCollections.users;
const images = mongoCollections.images;
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname +  path.extname(file.originalname));
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
  image:  new Buffer(encode_image, 'base64')
  };
  const data = await images();
  const insertInfo = await data.insertOne(finalImg);
  
  //console.log("ID: "+finalImg._id);
  const dude = await usersData.get(req.session.userId);
  await usersData.addImageTag(finalImg._id, dude._id);



  //if (err) return console.log(err);
    //maybe redirect somewhere else??
  console.log('saved to database');
  res.redirect('/');
});

router.get("/all", async function (req,res){

});

  


module.exports = router;