import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?:number
}

const connection:ConnectionObject={}

async function connectDB():Promise<void>{
    if(connection.isConnected===1)
        {
            console.log("Already Connected to database")
            return
        }
    
        try {
            const {connections}=await mongoose.connect(process.env.MONGOURI!)

            connection.isConnected=connections[0].readyState

            console.log("DB connected Successfully")
        } catch (error) {
            console.log(error)
            process.exit(1)
        }
}

export default connectDB