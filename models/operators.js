var mongooses = require('mongoose');  
var OperatorSchema = new mongooses.Schema({
   userName:{
        type: String,
        required: true,
        unique: true,
        minlength: 5
    }   
});
 
// OperatorSchema.pre('save',  function(next) {
//     var user = this;
 
//      });
 
module.exports = mongooses.model('Operator', OperatorSchema);
