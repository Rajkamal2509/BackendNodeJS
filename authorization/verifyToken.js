const jwt = require('jsonwebtoken');
const config = require("../config/helpers")
const bcrypt = require('bcryptjs');
// const ls = require('lo')
verifyToken = (req,res,next)=>{
    const authorization = req.headers['authorization'];
    let token;
    if(authorization){

       token = authorization.split('Bearer ')[1];
    }
    else{
        return res.json({
            status: 500,
            success:false,
            message : "Access Denied."
        })
    }
	
    if (!token){
        return res.json({
            status: 204,
            success:false,
            message : "No token provided."
        })

    }

    jwt.verify(token,config.secret, function(err, decoded) {
        if (err){
            return res.json({
                status : 500,
                success : false,
                error : err,
                message : "Access Denied."
            })
        }
        else {
            req.decoded = decoded;
            req.userId = decoded.id;
            next();
        }
    });

}

const tokenJwt = {};
tokenJwt.verifyToken = verifyToken;

console.log(verifyToken,"verifyToken")


module.exports = tokenJwt;