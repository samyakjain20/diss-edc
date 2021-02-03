const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const topicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: false
    }
}, {timestamps: true});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;