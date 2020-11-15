const express = require('express');
const router= express.Router();
const authMiddleware=require('../../middleware/auth');
const User = require('../../models/User');

//Details of Current User
router.get('/getCurrentUser',[authMiddleware], async (request,response,next)=>{
    try {
        
        console.log(request.body);
        const id = request.body.id;
        const user= await User.findById(id).select('-password');
        response.status(200).json(user);

    } catch (error) {
        console.log(error);
        response.status(500).json([{error:"Internal Server Error"}])
    }
})


module.exports=router;