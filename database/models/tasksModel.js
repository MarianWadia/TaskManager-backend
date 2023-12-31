const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    _listId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'List',
    }
})

const Task = mongoose.model('Tasks', TasksSchema);

module.exports = Task;