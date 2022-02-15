require('dotenv').config({ path: `${__dirname}/../../config/.env` });
const cloudinary = require('cloudinary');

const uploadImage = async (filePath) => {
  return new Promise(async (resolve, reject) => {
    if (!filePath || filePath.length === 0) {
      resolve(null);
    }
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const uploadedImage = await cloudinary.v2.uploader.upload(filePath);
      resolve(uploadedImage);
    } catch (error) {
      reject(null);
    }
  });
};

module.exports = uploadImage;
