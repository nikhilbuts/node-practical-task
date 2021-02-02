const _ = require('lodash');

const localization = require('../service/localization');
const Service = require('../service');
const User = require('../models/user');

module.exports = {
    
    authenticate: async (req, res, next) => {
        try {
            const params = _.pick(req.body, ['token']);
            if(_.isEmpty(params.token)) {
                return res.status(200).json(Service.response(3, localization.rightsFail, null));
            }
            const us = await User.findOne({ 'tokens.token': params.token });

            if(!us) {
                return res.status(200).json(Service.response(3, localization.tokenExpired, null));
            }
            console.log('User Object Token :: ', us);
            req.user = us;
            next();
        } catch (error) {
            res.status(200).json(Service.response(3, localization.ServerError, null));
        }
    }
}