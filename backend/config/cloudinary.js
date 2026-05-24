import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = async () => {

    console.log("Cloudinary Connecting...")

    cloudinary.config({
    
    //    MONGODB_URI=mongodb+srv://anushika_db_user:Doctor2026@cluster0.sbrakpu.mongodb.net/Prescripto
          cloud_name:"djkzegfam",
          api_key:"217429151457584",
          api_secret:"O13nXBRpQtd6FCYlLzRmBMdXfTM"
    })

    console.log("Cloudinary Connected")
}

export default connectCloudinary