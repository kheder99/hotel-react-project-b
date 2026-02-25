// const util = require('util')
// const gc = require('../config/index')
// const bucket = gc.bucket('all-mighti')

//  const uploadImage = (file) => new Promise((resolve, reject) => {
//   const { originalname, buffer } = file
//   console.log(file)
//   const blob = bucket.file(originalname)
//   const blobStream = blob.createWriteStream();
//   blobStream.on('error', err => {
//       console.log(err)
//     next(err);
//   });
//   blobStream.on('finish', () => {
//     // The public URL can be used to directly access the file via HTTP.
//     const publicUrl = format(
//       `https://storage.googleapis.com/${bucket.name}/${blob.name}`
//     );
//     return publicUrl;
//   });

//   blobStream.end(buffer);
// })
// module.exports=uploadImage;

const cloudinary = require("../config/cloudinary");

const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "hotels" }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      })
      .end(file.buffer);
  });
};

module.exports = uploadImage;
