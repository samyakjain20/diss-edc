const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const comSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
    // snippet: {
    //     type: String,
    //     required: true
    // },
    // body: {
    //     type: String,
    //     required: true
    // },
}, {timestamps: true});

const Comm = mongoose.model('comm', comSchema);
module.exports = Comm;