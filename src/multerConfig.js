import multer from "multer";
import * as path from 'path';
import {__dirname} from './abs_path.js' 

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,__dirname+'/public/uploads')
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