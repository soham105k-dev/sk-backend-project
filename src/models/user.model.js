import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const UserSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,  // storing url of image from 3rd party platform
            required:true, 
        },
        coverImage:{
            type:String,  // storing url of image from 3rd party platform
        },
        watchHistory:[{
            type:Schema.Types.ObjectId,
            ref:"Videos",
        }],
        password:{
            type:String,
            required:[true,"Password is required"],
        },
        refreshTokens:{
            type:String,
            
        }
        },{timestamps:true}
    
)
UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();    
    this.password = await bcrypt.hash(this.password,10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {   
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",UserSchema)  