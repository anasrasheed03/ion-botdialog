var express         = require('express'),
    routes          = express.Router();
var userController  = require('./controller/user-controller');
var operatorController  = require('./controller/operator-controller');
var passport	    = require('passport');
 
routes.get('/', (req, res) => {
    return res.send('Hello, this is the API!');
});
 
routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
routes.get('/userlist',userController.userlist);
routes.post('/operators',operatorController.operatorStatus);
routes.get('/onlineOperators',operatorController.onlineOperators);
routes.put('/updateoperators/:Id',operatorController.updateStatus);
routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `Hey ${req.user.operator}! I open at the close.` });
});
 
module.exports = routes;