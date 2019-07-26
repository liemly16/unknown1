const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let postSchema = new Schema({
    thumb: String,
    title: String,
    content: String
})

let Post = mongoose.model('Post', postSchema);

module.exports = Post;