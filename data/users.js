const mongoCollections = require("./collections");
const users = mongoCollections.users;


module.exports = {
    async create(firstName, lastName, email, gender, city, state, age, hashedPassword) {
      if (firstName == undefined || lastName == undefined ||
        gender == underfined || city==undefined || state==undefined
        ||age==undefined || hashedPassword==undefined) throw new Error("Input is undefined.");
      if (typeof firstName !== "string") throw new Error("FirstName needs to be a string.");
      if (typeof lastName !== "string") throw new Error("lastName needs to be a string.");
      if (typeof email !== "string") throw new Error("email needs to be a string.");
      if (typeof gender !== "string") throw new Error("gender needs to be a string.");
      if (typeof state !== "string") throw new Error("state needs to be a string.");
      if (typeof age !== "number") throw new Error("Age needs to be an integer.");
      if (typeof hashedPassword !== "string") throw new Error("hashedPassword needs to be a string.");
  
      const data = await users();
  
      var obj = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        city: city,
        state: state
      };
  
      const insertInfo = await data.insertOne(obj);
      if (insertInfo.insertedCount === 0) throw new Error("Could not add animal.");
      const newId = insertInfo.insertedId;
      const animal = await this.get(newId);
      return animal;
    },
  
    async getAll(){
      const animalCollection = await animals();
  
      const animal = await animalCollection.find({}).toArray();
  
      return animal;
    },
  
    async get(id){
      if(id == undefined) throw new Error("ID is undefined.");
      if(typeof id != "object" && typeof id !="string") throw new Error("ID must be string.");
      //var mongoose = require('./node_modules/mongoose');
      
      var ObjectID = require('mongodb').ObjectID;//Found this conversion at https://stackoverflow.com/questions/7825700/convert-string-to-objectid-in-mongodb
      if(ObjectID.isValid(id)){
        id = new ObjectID(id); // wrap in ObjectID
      }else{
        throw new Error("ID is not a valid ObjectID");
      }
  
      //console.log(typeof id);
      const data = await animals();
      const str = await data.findOne({_id: id })
      if(str===null) throw new Error("Can't find ID");
      return str;
    }
}  