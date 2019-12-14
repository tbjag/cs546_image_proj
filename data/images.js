const mongoCollections = require("./collections");
const images = mongoCollections.images;

async function addComment(content, authorId){
    if(content==undefined) throw new Error("Content is undefined.");
    if(authorId==undefined) throw new Error("AuthorId is undefined.");
    if(typeof content!="string") throw new Error("Content is not string.");
    if(typeof authorId!="string" && typeof authorId !="object") throw new Error("AuthorId is not string.");

    const commenter = await comments.get(authorId);

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


module.exports = {addComment};