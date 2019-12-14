const mongoCollections = require("./collections");
const images = mongoCollections.images;
const users = require("/users");
const comments = require("/comments");

//Put into image database
async function addComment(content, authorId){
    if(content==undefined) throw new Error("Content is undefined.");
    if(authorId==undefined) throw new Error("AuthorId is undefined.");
    if(typeof content!="string") throw new Error("Content is not string.");
    if(typeof authorId!="string" && typeof authorId !="object") throw new Error("AuthorId is not string.");

    const commenter = await users.get(authorId);

    let newComment = {
        time: Date.getTime(),
        content: content,
        author:{
            id: authorId,
            name: commenter.name
        } 
    };
    const commentCollection = await comments();

    const insert = await commentCollection.insertOne(newComment);
    const newId = insert.insertedId;
    return await this.getCommentById(newId);
}

//Get image by ID
async function get(id){
    var check = {};
    if(id == undefined) throw new Error("ID is undefined.");
    if(typeof id != "object" && typeof id !="string") throw new Error("ID must be string.");

    var ObjectID = require('mongodb').ObjectID;
    if(ObjectID.isValid(id)){
    id = new ObjectID(id); // wrap in ObjectID
    }else{
    throw new Error("ID is not a valid ObjectID");
    }

    const data = await images();
    const str = await data.findOne({_id: id })
    if(str===null){
    check = {message:"Image does not exist", status: false};
            return check;
            };
    return str;
}

async function getAll(){
    const imageCollection = await images();

    const img = await imageCollection.find({}).toArray();

    return img;
}

module.exports = {addComment, get, getAll};
