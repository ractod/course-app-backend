import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dvcj8rol6",
  api_key: "518471847385761",
  api_secret: "1OYovC9aLfmyhIerXcjavoBbdUg",
});

function uploader(files, type) {
  return new Promise(async (resolve, reject) => {
    try {
      const filesPromise = files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: type }, (error, result) => {
              if (result) {
                resolve(result)
              } else {
                reject();
              }
            })
            .end(file.buffer);
        });
      });
      const uploadedFiles = await Promise.all(filesPromise);
      resolve(uploadedFiles);
    } catch(error) {
      reject(error)
    }
  });
}

export default uploader;
export { cloudinary }