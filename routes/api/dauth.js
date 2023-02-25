const express =require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User =require("../../models/Duser");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const {check ,validationResult}= require("express-validator");
const config = require("config");

// @route  GET api/auth
// @desc   Test route
// @access Public

router.get("/",auth, async (req,res)=> {
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// @route  POST api/auth
// @desc   user  and token 
// @access Public

router.post("/",
[
check("email","enter valid email").isEmail(),
check("password"," password is required").exists()
],async (req,res)=> {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password} = req.body;
    
    try{
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]});
            
        }
        const payload={ 
            user:{
                id: user.id
            }
        }

        jwt.sign(payload,
            config.get("jwtToken"),
            {expiresIn: 360000},
            (err,token) =>{
                if(err) throw err;
                res.json({token});
            }
        );

        

    }catch(err){
        console.log(err.message);
        res.status(500).send("server error");
    };
    });
module.exports = router;