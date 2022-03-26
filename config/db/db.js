const mongoose = require('mongoose');

async function connectDb(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/clone_shopee_dev');
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect fail');
    }
}


module.exports = {connectDb};