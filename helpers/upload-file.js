const path = require('path');
const { v2: cloudinary } = require("cloudinary");
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
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};

module.exports = {
  upFile,
  deleteLocalFile,
  deleteCloudinaryFile,
};