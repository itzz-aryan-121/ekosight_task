import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,

    },
    tags: [{ 
        type: String 
    }],
    listId: {
        type: mongoose.Schema.Types.ObjectId,
    }
},{timestamps: true});


const listSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    order:{
        type: Number,
        default: 0
    },



},{timestamps: true})


const boardSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,

    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lists:[listSchema],
    cards:[cardSchema]
},{timestamps: true});


const Board = mongoose.model('Board', boardSchema);

export default Board;