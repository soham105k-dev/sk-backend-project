import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const uploadCloudinary=async(localFilePath)=>{
        try{
            if(!localFilePath) return "file path not found"
           const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto",
            })
            console.log("file uploaded successfully",response.url)
            return response;
        }
        catch(error){
            fs.unlinkSync(localFilePath)  // remove the locally saved temp files ass the upload operation gpot failed
            console.log(error,"error");
            return null
        }
    }

    export{uploadOnCloudinary}






    //   Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);