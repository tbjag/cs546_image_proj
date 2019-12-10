/* 
    DESCRIPTION: home page of site, if you are or aren't logged in -- 
    if not logged in, display login button somewhere on page
    if logged in, then display profile, images, and saved pics buttons instead,
    should have feed of links that of images that users post??? if too hard then we can talk about something else
*/
const express = require("express");
const data = require(""); // <- for image stream, and user auth don't implement yet
const router = express.Router();

//should only be this .get
router.get("/", (req,res) =>{
    if(req.session.user){
        //display user info -- might need to double check security on this one
        let tString = "Welcome " + "--username--";
        res.render("layouts/home", {title: tString, logged: true})
    }else{
        res.render("layouts/home", {title: "", logged: false})
    }
    return;
});

module.exports = router;


function auth(){
    //would use bcrypt to authenticate user while in route... 
    //so that....
}