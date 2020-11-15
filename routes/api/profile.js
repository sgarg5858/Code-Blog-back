const express = require('express');
const router= express.Router();


//
router.get('/',(request,response,next)=>{
    response.send("Profile");
})

module.exports=router;