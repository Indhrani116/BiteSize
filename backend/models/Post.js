const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            maxlength: 280
        },
        topic: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        bookmarks: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);