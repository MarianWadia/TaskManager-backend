const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const connectDB = mongoose.connect(`mongodb+srv://marianwadia55:sX8BbeU6kSVymJr5@taskmanager.epqab80.mongodb.net/TaskManager?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
}).then(()=>{
    console.log('connected successfully to database');
}).catch(err =>{
    console.log('error connecting to database');
    console.error(err)
})


module.exports = connectDB;