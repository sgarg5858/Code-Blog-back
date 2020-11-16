const express = require('express');
const router= express.Router();
const Profile = require('./../../models/Profile');
const User = require('../../models/User')
const authMiddleware = require('../../middleware/auth')

//GET CURRENT PROFILE PRIVATE ROUTE
router.get('/current',authMiddleware, async (request,response,next)=>{
    try {
        //Auth Middleware will add the userid
        const userid= request.body.id;
        const profile = await Profile.findOne({user:userid}).populate('user',['name']);

        if(!profile)
        {
           return response.status(400).json([{error:'No Profile Found'}]);  
        }
        return response.json(profile);
    } catch (error) {
     console.log(error);
     response.status(500).json([{error:'Internal Server Error'}]);   
    }
})

//CREATE OR UPDATE PROFILE private
router.post('/upsertProfile',authMiddleware,async(request,response,next)=>{

    try {
        const {company,website,location,status,skills,bio,githubusername,youtube,instagram,facebook,linkedin} =request.body;

        //Build Profile Object
        const profileFields={};
        profileFields.user=request.body.id;
        if(company)profileFields.company=company;
        if(website)profileFields.website=website;
        if(location)profileFields.location=location;
        if(status)profileFields.status=status;
        if(bio)profileFields.bio=bio;
        if(githubusername)profileFields.githubusername=githubusername;
        //get skills at string separated by , from frontend
        if(skills)
        {
            profileFields.skills=skills.split(",").map(skill => skill.trim());
        }
        console.log(profileFields.skills,skills);

        const social={};
        if(youtube){social.youtube=youtube};
        if(instagram){social.instagram=instagram};
        if(linkedin){social.linkedin=linkedin};
        if(facebook){social.facebook=facebook};
        profileFields.social=social;

        let profile =await  Profile.findOne({user:profileFields.user});

        //Update
        if(profile)
        {
            profile= await Profile.findOneAndUpdate(
                {user:profileFields.user},
                {$set:profileFields},
                {useFindAndModify:true})
            return response.json(profile);
        }
        else
        {
            profile= new Profile(profileFields);
            await profile.save();
            return response.json(profile);
        }
    } catch (error) {
        console.log(error);
        response.status(500).json([{error:'Internal Server Error'}]); 
    }

})


module.exports=router;