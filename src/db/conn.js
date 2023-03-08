const mongoose = require('mongoose');
const DB = process.env.DATABASE;

async function connectDB() {
    try {

        mongoose.set('strictQuery', true);
        const response = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${response.connection.host}`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;