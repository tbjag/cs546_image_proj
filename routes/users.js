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

router.get("/", (req,res) =>{
    if(req.session.user && req.cookies.name ==='AuthCookie') {
        res.redirect("/private");
    }else{
        res.render("users/login", { /*idk what to put here */ });
        //let str = new Date().toUTCString() + " " +req.method + " " + req.originalUrl + " " + "(Non-Authenticated User)";
        //console.log(str);
    }
});

router.post("/create", async (req, res) =>{
    const accounts = await usersData.get(req.params.id);
    res.json(animal);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let gender = req.body.gender;
    let city = req.body.city;
    let state = req.body.state;
    let age = req.body.age;
    let password = req.body.password;

    if(firstName&&lastName&&email&&gender&&city&&state&&age&&password){

        //CHECK IN MONGO DB IF EMAIL ALREADY EXISTS OR NAH
        emailExists = false;
        //CHECK HERE
        if(emailExists){
            res.status(401).render("layouts/profile", {message: "Email already in use."});
        }else{
            //ADD PROFILE TO THE DATABASE
            res.render("layouts/profile", {message: "You have successfully created a profile."});
        }

        //Bcrypt and store the password here

        
    }

});

router.post("/login", async (req, res) =>{
    let email = req.body.email;
    let passW = req.body.password;

    if(email && passW){
        //Check email
        eCheck = false;

        //PROLLY WONT WORK, GOTTA CHECK MONGO DB INSTEAD
        for (let person of users){
            if(person.email === email){
                eCheck = true;
            }
        }

        //Check password
        let pCheck = {};
        for (let person of users){
            if(person.username === userN){
                if(await bcrypt.compare(passW, person.hashedPassword)){
                    pCheck = {status: true, user: person};
                }else{
                    pCheck = {status: false, message: "Wrong password"};
                }
            }
        }

        if(uCheck && pCheck.status){
            let {_id, username, firstName, lastName, Profession, Bio} = pCheck.user;
            res.cookie("name", "AuthCookie");
            let user = {_id, username, firstName, lastName, Profession, Bio};
            req.session.user = user;
            res.redirect("/private");
        }else{
            res.status(401).render("users/login", {title: "Login", message: "Wrong username or password", status: false});
        }
    } else{
        res.render("users/login", {title: "Login", message: "You need to enter a username and password", status: false});
    } 
});


const auth = function auth(req, res, next) {
    let str = new Date().toUTCString() + " " +req.method + " " + req.originalUrl + " ";
    if(req.session.user && req.cookies.name === 'AuthCookie'){
        console.log(str + "(Authenticated User)");
        next();
    }else{
        console.log(str + "(Non-Authenticated User)");
        res.status(403).render("users/error", {title: "Error"});
    }
}

router.get("/private", auth, (req, res) => {
    let user = req.session.user;
    if(user){
        res.render("users/info",{id: user._id, username: user.username, first: user.firstName, last: user.lastName, prof: user.Profession, bio: user.Bio ,title: `Welcome ${user.firstName} ${user.lastName}`});
    }else{
        res.render("users/login", { title: "Login"});
    }
});

router.get("/logout", (req,res) =>{
    let str = new Date().toUTCString() + " " +req.method + " " + req.originalUrl + " " + "(Authenticated User)";
    console.log(str);
    res.clearCookie('name');
    res.redirect("/");
});

module.exports = router, auth;