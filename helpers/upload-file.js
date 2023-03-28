const path = require('path');
const { v4: uuidv4 } = require('uuid');
const upFile = ({ file }, validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf'], folder = '') => new Promise((resolve, reject) => {
  const nameCut = file.name.split('.');
  const extension = nameCut[nameCut.length - 1];

  if (!validExtensions.includes(extension))
    return reject(`The extension file: ${extension} is not valid. The valid extensions are: ${validExtensions}`);

  const tempFileName = uuidv4() + '.' + extension;
  const uploadPath = path.join(__dirname, '../uploads/', folder, tempFileName);

  file.mv(uploadPath, (err) => err ? reject(err) : resolve(tempFileName));

});

module.exports = {
  upFile
};