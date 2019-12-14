/* 
    DESCRIPTION: filtering route, where we interact with Sams image filters
    when used, display new page that selects options:
    - edit which image, 
    - then which filter,
    - send req,
    - user will wait for it fulfill 
    - have options to share and save with API's
*/

const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

router.post("/filters", async function (req,res){
    console.log("specificFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const filter = req.body.filt
        console.log(filter)
        const profile = await usersData.get(req.session.userId);
        const rend = "layouts/" + filter
        res.render(rend, {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });



router.get("/", async function (req,res){
    console.log("FILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const profile = await usersData.get(req.session.userId);
        res.render("layouts/filter", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });
  
  module.exports = router;
