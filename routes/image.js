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

router.post('/', upload.single('image'), (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database
  var finalImg = {
  contentType: req.file.mimetype,
  image:  new Buffer(encode_image, 'base64')
  };
  await images.insertOne(finalImg, (err, result) => {
  console.log(result)

  if (err) return console.log(err);
    //maybe redirect somewhere else??
  console.log('saved to database');
  res.redirect('/');


  });
});


  


module.exports = router;