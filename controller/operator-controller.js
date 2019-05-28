var Operator = require('../models/operators');
var config2 = require('../config/config2');

function createToken(operator) {
    return jwt.sign({ id: operator.id, username: operator.userName }, config2.jwtSecret, {
        expiresIn: 200 // 86400 expires in 24 hours
      });
}
exports.operatorStatus = (req, res) => {
    if (!req.body.userName) {
        return res.status(400).json({ 'msg': 'You need to send Operator Username' });
    }
 
    Operator.findOne({ userName: req.body.userName}, (err, operator) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
 
        if (operator) {
            return res.status(400).json({ 'msg': 'The user already loggedin' });
        }
 
        let newOperator = Operator(req.body);
        newOperator.save((err, operator) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }
            return res.status(201).json(operator);
        });
    });
};

exports.updateStatus = (req, res) => {
    Operator.findOneAndRemove(req.params.Id)
    .then(operator => {
        if(!operator) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.Id
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.Id
        });
    });
};


exports.onlineOperators = (req,res) => {
    Operator.find()
    .then(operator => {            
        res.send(operator);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
    });
});
};