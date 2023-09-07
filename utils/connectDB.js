import mongoose from "mongoose";

async function connectDB() {
   try {
      await mongoose.connect(process.env.MONGODB_URI,{
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      console.log("Mongodb is Connected")
   } catch(error) {
      console.log("Failed In Connecting To Mognodb" + error)
   }
}

export default connectDB