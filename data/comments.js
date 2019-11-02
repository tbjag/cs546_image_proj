const mongoCollections = require("./collections");
const comments = mongoCollections.comments;

module.exports = {
    async getAll(){//Get all comments
        const commentCollection = await comments();

        const comment = await commentCollection.find({}).toArray();

        return comment;
    },

    async getCommentById(id){
        if(id == undefined) throw new Error("ID is undefined.");
        if(typeof id != "object" && typeof id !="string") throw new Error("ID must be string.");

        var ObjectID = require('mongodb').ObjectID;
        if(ObjectID.isValid(id)){
            id = new ObjectID(id); 
        }else{
            throw new Error("ID is not a valid ObjectID");
        }
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: id });
        if(comment===null) throw new Error("Can't find comment with that ID.");
        return comment;
    },

    async addComment(content, authorId){
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
    },

    async removeComment(id) {
        if(id==undefined) throw new Error("ID is undefined");
        if(typeof id != "object" && typeof id !="string") throw new Error("ID must be string.");
        const commentCollection = await comments();

        var temp = await this.getCommentById(id);

        var ObjectID = require('mongodb').ObjectID;
        if(ObjectID.isValid(id)){
            id = new ObjectID(id);
        }else{
            throw new Error("ID is not a valid ObjectID");
        }
        let deleted = {deleted: true, data: temp};
        const deletionInfo = await commentCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw new Error("Could not delete comment with id of ${id}");
        }
        return deleted;
    }

};