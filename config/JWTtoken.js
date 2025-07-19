const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req,res,next) => {
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(400).json({error:"token not found"});
    
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(400).json({error:"Unauthorized"});

    try{
        const decoded = jwt.verify(token,'stafTrack');

        req.user = decoded;
        next();
    }
    catch(e){
        console.log(e);
        res.status(400).json({error:"invalid token"});
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData,'stafTrack',{expiresIn:'30d'});
};

module.exports = {jwtAuthMiddleware,generateToken};
