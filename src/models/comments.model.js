const { default: mongoose } = require('mongoose');

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: String
    },
    text: {
        type: String,
        required: true
    },
}, {timestamp: true});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;