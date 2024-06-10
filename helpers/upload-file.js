const path = require('path');
const { v2: cloudinary } = require("cloudinary");
cloudinary.config(process.env.CLOUDINARY_URL);
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const upFile = (
  { file },
  validExtensions = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "pdf",
    "txt",
    "docx",
    "doc",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "csv",
    "mp4",
    "avi",
    "mkv",
    "mov",
    "wmv",
    "flv",
    "webm",
    "mp3",
    "wav",
    "flac",
    "aac",
    "ogg",
    "wma",
    "mp3",
  ],
  folder = ""
) =>
  new Promise((resolve, reject) => {
    const nameCut = file.name.split(".");
    const extension = nameCut[nameCut.length - 1];

    if (!validExtensions.includes(extension))
      return reject(
        `The extension file: ${extension} is not valid. The valid extensions are: ${validExtensions}`
      );

    const tempFileName = uuidv4() + "." + extension;
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      folder,
      tempFileName
    );

    file.mv(uploadPath, (err) => (err ? reject(err) : resolve(tempFileName)));
  });

// Delete file from local server
const deleteLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Delete file from Cloudinary
const deleteCloudinaryFile = async (fileUrl) => {
  try {
    const nameArr = fileUrl.split("/");
    const nameFile = nameArr[nameArr.length - 1];
    const [public_id] = nameFile.split(".");
    console.log("public_id", public_id);
    await cloudinary.uploader.destroy(public_id);
    console.log("File deleted from Cloudinary");
  } catch (error) {
    throw new Error("Error deleting file from Cloudinary");
  }
};

// uploadFile Cloudinary
const uploadFileCloudinary = async (file, { model, collection }) => {
  console.log(`🚀 ~ uploadFileCloudinary ~ file:`, file);

  if (file && file.size && file.name !== "undefined") {
    try {
      if (model?.filePath || model?.image) {
        console.log("Deleting previous file");
        await deleteCloudinaryFile(model?.filePath || model?.image);
      }

      const { tempFilePath, mimetype } = file;

      if (
        !mimetype.startsWith("image") &&
        (collection === "user" || collection === "category")
      ) {
        console.log("The file isn't an image");
        throw new Error("The file isn't an image");
      }

      const data = await cloudinary.uploader.upload(tempFilePath);

      if (collection === "user" || collection === "category") {
        Object.assign(model, { image: data.secure_url });
      }

      return data;
    } catch (error) {
      throw new Error(
        "Error uploading file to Cloudinary, error: " + error.message
      );
    }
  }
};

module.exports = {
  upFile,
  deleteLocalFile,
  deleteCloudinaryFile,
  uploadFileCloudinary,
};