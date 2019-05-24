var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
  
var UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required:true,
        maxlength: 30,
        minlength: 4
    },
    password:{
        type: String,
        required: true,
        maxlength: 255,
        minlength: 8
    },
    email:{
        type: String,
        required: true,
        unique:true,
        minlength: 8
    },
    userName:{
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    operator:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    }
});
 
UserSchema.pre('save',  function(next) {
    var user = this;
 
     if (!user.isModified('password')) return next();
 
     bcrypt.genSalt(10, function(err, salt) {
         if (err) return next(err);
 
         bcrypt.hash(user.password, salt, function(err, hash) {
             if (err) return next(err);
 
             user.password = hash;
             next();
         });
     });
});
 
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('User', UserSchema);
