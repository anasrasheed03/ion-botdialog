const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
 
router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        
       user = new User(_.pick(req.body, ['userName', 'email', 'password','fullName','gender']));
        // user = new User({
        //     userName: req.body.userName,
        //     password: req.body.password,
        //     email: req.body.email,
        //     fullName: req.body.fullName,
        //     gender: req.body.gender
        // });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        await user.save();
        res.send(user);
        res.send(_.pick(user, ['_id', 'userName', 'email','fullName']));
    }
});
 
module.exports = router;