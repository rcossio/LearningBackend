import multer from "multer";
import * as path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join('./public/uploads'))
    },
    filename: function (req,file,callback){
        callback(null,`${Date.now()}.${path.extname(file.originalname)}`)
    }
})

const uploader = multer({
    storage: storage,
    onError: function (err,next) {
        console.error('Error:',err)
        next()
    }
})

export {uploader}