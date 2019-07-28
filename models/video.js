const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let videoSchema = new Schema({
    title: String,
    path: String
})

let Video = mongoose.model('Video', videoSchema);

module.exports = Video;