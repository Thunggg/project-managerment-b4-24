const cloudinary = require('cloudinary').v2 // thư viện đẩy ảnh lên cloudiary
const streamifier = require('streamifier') // thư viện đẩy ảnh lên cloudiary

//cài đặt cho cloudiary
cloudinary.config({ 
    cloud_name: 'dgbnjk943', 
    api_key: '758841269621527', 
    api_secret: 'h-HVwRPqOr_kNWoeo-y1WqbbPm0' // Click 'View API Keys' above to copy your API secret
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