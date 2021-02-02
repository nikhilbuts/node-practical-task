const Service = require('../api/service/auth');
const UserController = require('../api/controller/userController');
const config = require('../config');
const auth = require('./../api/service/auth');

module.exports = (router) => {

    /**
     * Users API
     */
    router.post('/api/v1/signup', UserController.signup);
    router.post('/api/v1/login', UserController.login);
    router.get('/api/v1/users',UserController.listOfUser);
    router.patch('/api/v1/updateUser', Service.authenticate, UserController.updateUser);
    router.delete('/api/v1/deleteUser', Service.authenticate, UserController.deleteUser);

};
