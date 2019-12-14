/* 
    DESCRIPTION: home page of site, if you are or aren't logged in -- 
    if not logged in, display login button somewhere on page
    if logged in, then display profile, images, and saved pics buttons instead,
    should have feed of links that of images that users post??? if too hard then we can talk about something else
*/
const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

//should only be this .get
router.get("/", async function (req,res){
  if(req.session.userId){
  try{
    if(req.session.userId){
      console.log("here");
      //kurt fill out
      //var ObjectID = require('mongodb').ObjectID;
      console.log("ID: " + req.session.userId);
      const profile = await usersData.get(req.session.userId);
      res.render("layouts/home", {logged:true, username: profile.firstName});
      return;
    }else{
      res.render("layouts/home", {title: "PSLite", logged:false});
      return;
    }
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
}else{
  //const profile = await usersData.get(req.session.userId);
  res.render("layouts/home", {logged:false});
}
});

module.exports = router;