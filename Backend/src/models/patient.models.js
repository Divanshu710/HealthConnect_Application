import mongoose,{Schema} from "mongoose";

const patientSchema=new Schema(
    {
        aadhar_id:{
           type:String,
           required:true,
           unique:true,
        //    match:[/^\d{12}$/, 'Invalid Aadhar number']
        },
        username:{
           type:String,
           required:true,
           trim: true
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        age:{
            type:Number,
            required:true
        },
        gender:{
            type:String,
            enum:["male","female","others"]
        },
        contactno:{
            type:String,
            required:true,
            // match:[/^\d{10}$/, 'Invalid Phone number']
        },
        email:{
            type:String,
            trim: true,
            unique:true,
            default:""
        },
        medical_history:{
            type:String,
            trim: true,
            default:""
        }
        },
        {timestamps:true}
)
export const Patient = mongoose.model("Patient",patientSchema)