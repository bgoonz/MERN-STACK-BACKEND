const HttpError = require( "../models/http-error" );
module.exports = function ( req, res, next ) {
    //Authorization: 'Bearer TOKEN' ... split on space[1] gives us the token
    const token = req.header.authorization.split( " " )[ 1 ];
    if ( !token ) {
        const error = new HttpError( "Authentication failed.", 401 );
    }
        
};
