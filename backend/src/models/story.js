import mongoose from "mongoose";


const storySchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    publishStatus: {
        type: Boolean,
        default: 0 // 0 = private, 1 = public
    },
    price: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    backgroundColor: {
        type: String,
        required: true
    },
    genres: [{
        type: String,
        required: true
    }],
    MPAFilmRatings: {
        type: String,
        required: true
    }, slide: [{
        content: {
            type: String
        },
        slideNumber: {
            type: Number
        }
    }],
});

const Story = mongoose.model('Story', storySchema);


export default Story;