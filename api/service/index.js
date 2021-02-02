const jwt = require('jsonwebtoken');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const config = require('../../config');
const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
const _ = require('lodash');

module.exports = {
    response: (status, message, data) =>  {
        return {
            status: status,
            message: message,
            data: data,
        };
    },

    truncateString: function (str, no_words) {
        return str.split(" ").splice(0, no_words).join(" ") + '..';
    },

    issueToken: (data) => {
        return jwt.sign(data, config.apiSecret,{expiresIn: '365d' });
    },

    verifyApiToken: async function (token) {
        if (token) {
            us = await User.findOne({
                'tokens.token': token,
            });

            if (us)
                return {
                    status: true,
                    user: us,
                };
            else
                return {
                    status: false,
                };
        } else {
            return {
                status: false,
            };
        }
    },

    validateEmail: (email) => {
        const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        return re.test(email);
    },

    validatePassword: (password) => {
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
        return re.test(password)
    },


    valiDate: (date) => {
        const re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        return re.test(date);
    },

    valiDateObject: (date) => {
        const da = new Date(date);
        if (da) return true;
        return false;
    },

    validateObjectId: (id) => {
        if (ObjectId.isValid(id)) {
            const obj = new ObjectId(id);
            if (obj == id) {
                return true;
            }
        }
        return false;
    },


    formateDate: function (date) {
        // 7/12/2018 12:25PM
        
        var dat = new Date(date);
        dat.setHours(dat.getHours() + 3);
        var mon = (dat.getMonth() + 1 > 9) ? dat.getMonth() + 1 : "0" + parseInt(dat.getMonth() + parseInt(1));


        var hours = dat.getHours() % 12;
        hours = (hours > 9) ? hours : "0" + hours;

        var minutes = dat.getMinutes();
        minutes = (minutes > 9) ? minutes : "0" + minutes;

        var ap = (dat.getHours() >= 12) ? "PM" : "AM";
        var day = (dat.getDate() > 9) ? dat.getDate() : "0" + dat.getDate();

        rez = day + "/" + mon + "/" + dat.getFullYear() + " " + hours + ":" + minutes + ap;

        return rez;
    },

    formatMoment: function (date) {
        const dat = new Date(date);
        return moment.utc(dat ).local().format('YYYY-MM-DD HH:mm:ss');
    },

}
