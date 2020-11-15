const jwt= require('jsonwebtoken');
const jwtSecretKey="userToken";


const authMiddleware= (req,res,next)=> {

    //Get Token From Header
    const token = req.header('x-auth-token');

    //Check if no token
    if(!token)
    {
        return res.status(401).json({msg: "No Authorization Token"});
    }

    //Verify Token
    try {
        const decoded=jwt.verify(token,jwtSecretKey);
        console.log(decoded);
        req.body.id=decoded.id;
        next();

    } catch (error) {
        return res.status(401).json({msg:"Invalid Token"});
    }

}

module.exports=authMiddleware