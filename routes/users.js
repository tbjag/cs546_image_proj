/* 
    DESCRIPTION: helps authenticate and display user info
    here the user can log into existing account and create a new one,
    think of google account login.
    profile info should be name, age, username etc. 
*/
const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const commentsData = data.comments;
const imageData = data.images;
const xss = require("xss");

router.get("/", async function (req,res){
  if(!req.session.userId){
    //console.log("No session");
    res.render("layouts/profile", {logged:false, title:"Profile"});
    return;
  }else{
  try{
    if(req.session.userId){
      //kurt fill out
      //var ObjectID = require('mongodb').ObjectID;
      const profile = await usersData.get(req.session.userId);
      res.render("layouts/profile", {logged:true, username: profile.firstName, welcomeTitle: "Welcome "+profile.firstName, firstname: profile.firstName, lastname: profile.lastName, age: profile.age, email: profile.email, gender: profile.gender, city: profile.city, state: profile.state});
      return;
    }else{
      res.render("layouts/profile", {title: "PSLite", logged:false});
      return;
    }
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
}
});

//POST route for updating data
router.post('/acct', async function (req, res, next) {
    //console.log(req.body.email);
    //console.log(req.body.password);
  if (xss(req.body.email) &&
    xss(req.body.password) && //IDK WHY THIS PASSWORD DOESNT STAY
    xss(req.body.firstname) &&
    xss(req.body.lastname) &&
    xss(req.body.gender) &&
    xss(req.body.state) &&
    xss(req.body.city) &&
    xss(req.body.age)) {

    var userData = {
      email: xss(req.body.email),
      password: xss(req.body.password),
      firstName: xss(req.body.firstname),
      lastName: xss(req.body.lastname),
      gender: xss(req.body.gender),
      state: xss(req.body.state),
      city: xss(req.body.city),
      age: xss(req.body.age)
    };

    try{
      const newUser = await usersData.create(userData);//Adds user data into the database
      if(newUser.status == false){
        res.render('layouts/profile', {registerstatus: false, registermessage: newUser.message});
        return;
      }
      req.session.userId = newUser;
      //console.log(newUser);
      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: userData.firstName, imgarray: arr});
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else if (req.body.logemail && req.body.logpassword) {//If the user tried to login run this
    try{
      const checkLogin = await usersData.checkLogin(req.body.logemail, req.body.logpassword);//Check Login needs to be tested
      const dude = await usersData.getEmail(req.body.logemail);
      if(dude.status == false){
        res.render('layouts/profile', {loginstatus: false, loginmessage: dude.message});
        return;
      }

      req.session.userId = dude._id;

      if (checkLogin.status) {
        let arr = await imageData.getAll();
        res.render("layouts/home", {logged:true, username: dude.firstName, imgarray: arr});
        return;
      } else {
        res.render('layouts/profile', {loginstatus: false, loginmessage: checkLogin.message});
        return;
      }                                
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  } else {//User did not fill out all fields in login or register
    res.render('layouts/profile', {loginstatus:false, registerstatus: false, registermessage: "Log in or Register", loginmessage:"Log in or Register"});
    return;
  }
});


// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
