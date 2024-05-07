const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }
}, {timestamps: true})

const Comment = model("Comment", commentSchema);

module.exports = Comment;