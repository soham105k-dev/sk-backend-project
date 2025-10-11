import { request, response } from 'express'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary, uploadToCloudinary } from '../utils/cloudinary.js'
import upload from '../middlewares/mullter.middleware.js'
import {ApiRespons} from '../utils/ApiRespons.js'

const registerUser = asyncHandler(async (req,res)=>{
    //get user details from frontend
    //validation - not empty
    //check if user aalready exist:username,email
    //check for images,check for avatars 
    //upload them to cloudinary ,avatar
    //create user object-create entry in db 
    // remove password and refresh token field from response
    //check for user creation 
    //return res

    const {fullname,username,email,password} = req.body
    console.log("email:",email)

    if(
        [fullname,username,email,password].some((field)=>field?.trim()=== "")
    ) {
        throw new ApiError("All fields are required", 400)
    }

    const existingEmail = await User.findOne({ email })
    if(existingEmail){
        throw new ApiError("Email already exists", 409)
    }

    const existingUser = await User.findOne({ username })
    if(existingUser){
        throw new ApiError("username already exists",409)
    }

    const avatarLocalpath = req.files?.avatar[0]?.path
    const coverImageLocalpath = req.files?.coverImage[0]?.path

    if(!avatarLocalpath){
        throw new ApiError("avatar is required",400)
    }

    const avatar =await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if(!avatar){
        throw new ApiError("avatar is required",400)
    }

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshTokens")
    if(!createdUser){
        throw new ApiError("something went wrong while registering the user ",500)
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )



})

export {registerUser}

