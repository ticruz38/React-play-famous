'use strict';

//var debug = require('debug');



var validate = require('./validate.js');
var authStore = require('../stores/authstore');

module.exports = function(actionContext, details, done) {
    //Signup stuff
    if (details.form === 'signup') {
        var unvalid = validate.falseSignupDetails(details); //valid or not mail password etc
        if (!unvalid) {
            actionContext.service.create('login', details, {}, function(err, result) { //result is rethinkdb object and details is for signupdetails
                if (err) {
                    console.log(err);
                } else if (result.inserted && result.inserted !== 1) {
                    console.log('Document wasnt inserted');
                } else if (result.errors.emailUsed) {
                    console.log(result);
                    actionContext.dispatch('Signup', result);
                } else {
                    delete details.password, details.confirmPassword;
                    actionContext.dispatch('Signup', details);
                }
            });
        } else {
            actionContext.dispatch('Signup', unvalid);
        }
    // Login Stuff
    } else if (details.form === 'login') {
        var onvalid = validate.falseLoginDetails(details);
        if (!onvalid) {
            actionContext.service.read('login', details, {}, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    actionContext.dispatch('Login', data);
                }
            });
        } else {
          actionContext.dispatch('Login', onvalid);
        }
    } else {
        //details is user id here
        //we need to transform details string into object to avoid problems....
        var id = details;
        details = {};
        details.id = id;
        actionContext.service.read('login', details, {}, function(err, data) { //err is allways null here
          delete data.password;
          delete data.confirmPassword;
          details.handler = null;
          details.logged = true;
          details.loginDetails = {};
          details.loginDetails.mail = data.mail;
          if(data.pseudo) details.loginDetails.pseudo = data.pseudo;
          if(data.avatar) details.loginDetails.avatar = data.avatar;
          actionContext.getStore(authStore).rehydrate(details, done);
        });
    }
};
