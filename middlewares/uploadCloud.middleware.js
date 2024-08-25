const cloudinary = require('cloudinary').v2 // thư viện đẩy ảnh lên cloudiary
const streamifier = require('streamifier') // thư viện đẩy ảnh lên cloudiary

//cài đặt cho cloudiary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET
});


module.exports.uploadSingle = function (req, res, next) {
    if(req.file){
        let streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
    
              streamifier.createReadStream(buffer).pipe(stream);
            });
        };
    
        const uploadToCloudinary = async function upload(buffer) {
            let result = await streamUpload(buffer);
            req.body[req.file.fieldname] = result.url;
            next();
        }
    
        uploadToCloudinary(req.file.buffer);
    }
    else{
        next();
    }
}