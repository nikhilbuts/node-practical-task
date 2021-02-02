const _ = require("lodash");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const localization = require("../service/localization");
const Service = require("../service");
const config = require("../../config");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

module.exports = {
    signup: async (req, res) => {
        try {
            const params = _.pick(req.body, [
                "name",
                "email",
                "password"
            ]);
            console.log("Register Request :: ", params);

            let resObj = {};

            if (
                _.isEmpty(params.name) ||
                _.isEmpty(params.email)
            ) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }

            if (!Service.validateEmail(params.email)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.emailValidationError, null));
            }

            const us = await User.findOne({
                email: params.email.trim().toLowerCase()
            });
            if (us) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.emailExistError, null));
            }

            const token = await Service.issueToken(params);

            const user = new User({
                name: params.name,
                created_at : new Date(),
                email: params.email.toLowerCase(),
                password: bcrypt.hashSync(params.password),
                tokens: {
                    token: token,
                },
            });

            const rez = await user.save();

            if (!rez) {
                res
                    .status(200)
                    .json(Service.response(0, localization.ServerError, null));
            }

            resObj = {
                id: rez._id,
                email: rez.email,
                token: token,
                name: rez.name,
                created_at: await Service.formateDate(rez.created_at)
            };

            res
                .status(200)
                .json(Service.response(1, localization.registerSuccess, resObj));
        } catch (err) {
            res
                .status(200)
                .json(Service.response(0, localization.ServerError, err.message));
        }
    },

    /**
     * User Login
     */

    login: async (req, res) => {
        try {
            const params = _.pick(req.body, ["email", "password"]);
            console.log("Login Request ::", params);
            if (
                _.isEmpty(params.email) ||
                _.isEmpty(params.password)
            ) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }
            if (!Service.validateEmail(params.email)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.emailValidationError, null));
            }

            const us = await User.findOne(
                {email: params.email},
            );


            if (!us) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.AccountError, null));
            }

            const isValid = await bcrypt.compare(params.password, us.password);

            if (!isValid) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.invalidCredentials, null));
            }

            let token = "";
            if (!(us.tokens.token)) {
                token = await Service.issueToken(us.toObject());
            }else{
                token = us.tokens.token;
            }
            us.tokens.token = token;
            await us.save();
            const resObj = {
                id: us._id,
                email: us.email,
                token: token,
                name: _.toString(us.name),
                created_at: await Service.formateDate(us.created_at)
            };
            console.log("Final Obj Login ::", resObj);
            res
                .status(200)
                .json(Service.response(1, localization.loginSuccess, resObj));
        } catch (err) {
            res
                .status(200)
                .json(Service.response(0, localization.ServerError, err.message));
        }
    },

    /**
     * List User
     */
    listOfUser: async (req, res) => {
        try {
            const users = await User.find({}, 'name email').sort({'created_at': -1});
            if (!users) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const list = await Promise.all(users.map(async (u) => {
                return {
                    'id': u._id,
                    'name': u.name,
                    'email': u.email,
                }
            }));
            res.status(200).json(Service.response(1, localization.Success, list));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    /**
     * Update User
     */
    updateUser: async (req, res) => {
        try {
            const params = _.pick(req.body, ["name"]);
            req.user.name = params.name;

            const rez = await req.user.save();

            if (!rez) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            resObj = {
                id: rez._id,
                email: rez.email,
                token: rez.tokens.token,
                name: rez.name,
                created_at: await Service.formateDate(rez.created_at)
            };
            return res.status(200).json(Service.response(1, localization.updateUserSuccess, resObj));
        } catch (error) {
            console.log('Error Occured While Editing Profile For User :: ', error)
        }
    },

    /**
     * Delete User
     */

    deleteUser: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const rez = await User.findByIdAndDelete(params.id);

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            res.status(200).json(Service.response(1, localization.deleteUser, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },
  
};
