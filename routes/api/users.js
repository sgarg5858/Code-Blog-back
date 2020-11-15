const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User =require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey="userToken";
//SIGNUP POST API PUBLIC

router.post('/signup',[
    check('name','name is required').not().isEmpty(),
    check('email',"Enter valid email").isEmail(),
    check('password',"Minimum 6 characters required").isLength({min:6})

], async (request,response,next)=>{

    const errors=validationResult(request);
    if(!errors.isEmpty())
    {
        return response.status(400).json({
            error:errors.array()
        });
    }
    console.log(request.body);
    //Destructuring
    const {name,email,password} =request.body;

    try {
        //Check if user already has account by email
        let user = await User.findOne({email});
        if(user)
        {
           return response.status(400).json([{error:"This email is already registered"}]);
        }
        user = new User({
            name,
            email,
            password
        });

        //Encrypt Password
        const salt = await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password,salt);
        
        //Add user to db
        const user1=await user.save();
        console.log(user1);
        //Return JSONWEBTOKEN
        const payload={
            id:user1.id,
            email:user1.email,
            name:user1.name
        }

        //Will Expire in 2 hours
        jwt.sign(payload,jwtSecretKey,
            {expiresIn:7200},
            (err,token)=>{
                if(err)
                {
                    throw err;
                }
                else
                {
                    response.json({token})
                }
        });
    } catch (error) {
        console.log(error,error.message);
        response.status(500).json([{error:'Internal Server Error'}]);
    }
})

//Login API POST public
router.post('/login',[
    check('email','Please include valid email').isEmail(),
    check('password','Password is required').exists()
],
  async (request,response,next)=>{

    const errors= validationResult(request);
    if(!errors.isEmpty())
    {
        return response.status(400).json({error:errors.array()})
    }
    console.log(request.body);
    const {email,password}= request.body;

    //Check whether user has an account or not
    try {
        
        const user=await User.findOne({email});
        if(user==null)
        {
          return  response.status(400).json([{error:"This email is not registered"}]);
        }
        console.log(user);

        //Matching Password using bcrypt
        const isMatch =  await bcrypt.compare(password,user.password);

        if(!isMatch)
        {
            return  response.status(400).json([{error:"Invalid Credentials"}]);

        }
        const payload={
            id:user.id,
            email:user.email,
            name:user.name
        }
        jwt.sign(payload,jwtSecretKey,{expiresIn:7200},(err,token)=>{
            if(err)
                {
                    throw err;
                }
                else
                {
                    response.json({token})
                }
        })

    } catch (error) {
        console.log(error,error.message);
        response.status(500).json([{error:'Internal Server Error'}]);
    }    


})

module.exports=router;