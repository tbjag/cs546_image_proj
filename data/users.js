const mongoCollections = require("./collections");
const users = mongoCollections.users;
const bcrypt = require('bcrypt');

module.exports = {
    async create(userData) {
      check = {};
      if (userData.firstName == undefined || userData.lastName == undefined ||
        userData.gender == undefined || userData.city==undefined || userData.state==undefined
        ||userData.age==undefined || userData.password==undefined){
          check = {message: "Input is undefined", status: false};
          return check;
        }
      if (typeof userData.firstName !== "string"){
        check = {message: "Invalid firstName", status: false};
        return check;
      }
      if (typeof userData.lastName !== "string"){
        check = {message: "Invalid lastName", status: false};
        return check;
      }
      if (typeof userData.email !== "string"){
        check = {message: "Invalid email.", status: false};
        return check;
      }
      if (typeof userData.gender !== "string"){
        check = {message: "Invalid gender.", status: false};
        return check;
      }
      if (typeof userData.state !== "string"){
        check = {message: "Invalid state.", status: false};
        return check;
      }
      if (typeof userData.city !== "string"){
        check = {message: "Invalid city.", status: false};
        return check;
      }
      if (typeof parseInt(userData.age) !== "number"){
        check = {message: "Invalid age.", status: false};
        return check;
      }
      if (typeof userData.password !== "string"){
        check = {message: "Invalid password.", status: false};
        return check;
      }
      const data = await users();
      const emails = await data.findOne({email: userData.email});
      if(emails!==null){
        check = {message:"An account already exists with that email.", status: false};
        return check;
      }

      //hash the password with 6 rounds of salt
      for (let saltRounds = 0; saltRounds < 6; saltRounds++) {
        var hashedPassword = bcrypt.hashSync(userData.password, saltRounds);
      }

  
      var obj = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        gender: userData.gender,
        city: userData.city,
        state: userData.state,
        age: userData.age,
        hashedPassword: hashedPassword,
        imageTag: []
      };
      
      const insertInfo = await data.insertOne(obj);
      //console.log(insertInfo);
      if (insertInfo.insertedCount === 0) throw new Error("Could not add new user.");
      const newId = insertInfo.insertedId;
      const user = await this.get(newId);
      return user._id;
    },

    async addImageTag(img){
      const userCollection = await users();
      //const user = await userCollection.get(id);
      await userCollection.updateOne(
        {"_id": id},
        {$set: {"imageTag":img}} );
    },

    async checkLogin(user, pass){
      const userCollection = await users();
      var check = {};
      //var message;
      if(user==undefined ||pass==undefined){
        check = {message: "Email and password must be input", status: false};
        return check;
      }
      if(typeof user != "string" || typeof pass !="string"){
        check = {message: "Email and password must be strings", status: false};
        return check;
      }
      //Check email
      const str = await userCollection.findOne({email: user});
      if(str===null){
        check = {message:"Incorrect username or password", status: false};
        return check;
      }
      if(str.email === user){
        check = {message:"good email", status: true};
        if(await bcrypt.compare(pass, str.hashedPassword)){
          check = {message:"good password", status: true};
        }else{
          check = {message:"Incorrect email or password", status: false};
        }
        return check;
      }else{
        check = {message:"Incorrect email or password", status: false};
        return check;
      }
  }, 

    async getAll(){
      const userCollection = await users();
  
      const user = await userCollection.find({}).toArray();
  
      return user;
    },
    async getEmail(email){
      if(email == undefined) throw new Error("email is undefined.");
      var check = {};
      if(typeof email != "string" && typeof id !="string"){
        check = {message:"Email must be a string", status: false};
        return check;
      }
      const data = await users();
      const str = await data.findOne({email: email })
      if(str===null){
        console.log("str null");
        check = {message:"Incorrect email or password", status: false};
        return check;
      };
      console.log("str out");
      return str;
    },
    async get(id){
      //console.log(id);
      var check = {};
      if(id == undefined) throw new Error("ID is undefined.");
      if(typeof id != "object" && typeof id !="string") throw new Error("ID must be string.");

      var ObjectID = require('mongodb').ObjectID;
      if(ObjectID.isValid(id)){
        id = new ObjectID(id); // wrap in ObjectID
      }else{
        throw new Error("ID is not a valid ObjectID");
      }

      const data = await users();
      const str = await data.findOne({_id: id })
      if(str===null){
        check = {message:"Incorrect email or password", status: false};
        return check;
      };
      return str;
    },
    async checkId(id){
      //checks if email exists in db
      if(id == undefined) throw new Error("Email is unidentified");
      //if(typeof email != "string") throw new Error("Email must be string");

      const data = await users();
      const str = await data.findOne({_id: id })
      if(str===null) return false;

      return true;
    }
}; 
