const mongoose = require('mongoose');

const connectDB = async() =>{
    try {

     const db="mongodb+srv://sanjay98:sanjay98@devconnector.yv4dw.mongodb.net/<dbname>?retryWrites=true&w=majority";   
     const res = await mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true });
     console.log("Mongo DB Connected");  
    } catch (error) {
        console.log(error,"Mongo DB connection failed");

        //Exit process with failure
        process.exit(1);
    }
}

module.exports={connectDB};