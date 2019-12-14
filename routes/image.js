const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const mongoCollections = require("../data/collections");
const images = mongoCollections.images;
const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
 
var upload = multer({ storage: storage });

// @route GET /
// @desc Loads form
router.get("/", async function (req,res){
  console.log("IMAGE");
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

router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
    res.send(file);
  
});


  


module.exports = router;