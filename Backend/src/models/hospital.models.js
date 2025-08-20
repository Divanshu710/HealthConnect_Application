import mongoose,{Schema} from "mongoose";

const hospitalSchema=new Schema({
         name:{
            type:String,
            required:[true,"Hospital name is required"],
            trim:true
         },
         address:{
            type:String,
            required:true,
            trim:true
         },
         email:{
            type: String,
            trim:true,
            required:true,
            lowercase:true,
            match: [/\S+@\S+\.\S+/, 'Invalid email address']
         },
         contact_info:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
         },
         },
        {timestamps:true}
    )
export const Hospital=mongoose.model("Hospital",hospitalSchema)