const multer = require('multer');
const path = require('path');
const { uuid } = require('uuidv4');

const storage = multer.diskStorage({
    destination: function(req, file, cb ){
        cb(null, path.join(__dirname, '../public/imgs/users/avts'));
    },
    filename: function(req, file, cb){
        const index = file.originalname.lastIndexOf('.');
        const fileName = file.originalname.slice(index);
        const pathFile = uuid() + fileName;
        cb(null, pathFile);
    }
});
 

const uploadAvt = multer({ storage: storage });

module.exports = uploadAvt;