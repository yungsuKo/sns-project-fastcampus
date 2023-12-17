const {default: mongoose} = require('mongoose');

const postSchema = mongoose.Schema({
    description: String,
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: String
    },
    images: {
        type: String
    },
    likes: [{type: String}]
}, {timestamp: true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
