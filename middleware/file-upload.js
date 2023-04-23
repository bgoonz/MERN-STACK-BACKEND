const multer = require( 'multer' );
const { v1: uuidv1 } = require( 'uuid' );
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const fileUpload = multer( {
    limits: 500000,//in bytes 
    storage: multer.diskStorage( {
        destination: ( req, file, cb ) => {
            cb( null, 'uploads/images' );
        }
        ,
        filename: ( req, file, cb ) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb( null, uuidv1() + '.' + ext );
        }
    } ),
    fileFilter: ( req, file, cb ) => {
        if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            cb( null, true );
        } else {
            cb( new Error( 'Invalid mime type, only JPEG and PNG' ), false );
        }
    }
    
    
    
} )
module.exports = fileUpload;
