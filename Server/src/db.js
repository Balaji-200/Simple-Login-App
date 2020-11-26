const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{
      const connect = await mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false,useCreateIndex: true });
      console.log(`Connected to MongoDB ${connect.connection.host}`);
    }catch(err){
      console.log(err);
    }
}

module.exports = connectDB;