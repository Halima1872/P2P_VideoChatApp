const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsConfig = {
    origin: 'http://localhost:5173',
    credentials: true,
    };

const authRoute = require('./routes/auth');

dotenv.config();

const connect = async() =>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    }catch(err){
        throw(err);
    }
}

//middleware
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());

//routes
app.use('/api/auth', authRoute);


//error handling
app.use((err,req,res,next) => {
    const errorMessage = err.message || "Something went wrong";
    const errorStatus = err.status || 500;
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
      });
})

app.listen(8080, () => {
    connect();
    console.log('Server is running on port 8080');
});