const mongoCollections = require("./collections");
const images = mongoCollections.images;
const users = require("./users");
const comments = require("./comments");


//Put into image database
async function addComment(content, authorId, imgId){
    if(content==undefined) throw new Error("Content is undefined.");
    if(authorId==undefined) throw new Error("AuthorId is undefined.");
    if(typeof content!="string") throw new Error("Content is not string.");
    if(typeof authorId!="string" && typeof authorId !="object") throw new Error("AuthorId is not string.");

    const commenter = await users.get(authorId);

    let newComment = {
        time: Date.getTime(),
        content: content,
        author:commenter.name
    };
    const image = await image();

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

async function getPath(id){
    //if (typeof id !== "string") throw "You must provide an id to search for";

    const imageCollection = await images();
    console.log(id)
    const image = await imageCollection.findOne({ _id: id });
    if (image === null) throw "No image with that id";

    return image.filepath;
}

async function getAll(){
    const imageCollection = await images();
    const img = await imageCollection.find({}).toArray();
    return img;
}

module.exports = {addComment, get, getAll, getPath};
