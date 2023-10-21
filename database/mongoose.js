const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

const connectDB = mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
}).then(()=>{
    console.log('connected successfully to database');
}).catch(err =>{
    console.log('error connecting to database');
    console.error(err)
})


module.exports = connectDB;