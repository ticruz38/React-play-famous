/*global MainLayout*/

'use strict';
var createStore = require('fluxible/addons').createStore;

var LoginStore = createStore({

    storeName: 'AuthStore',

    handlers: {
        'Signup': 'handleSignup',
        'Login': 'handleLogin',
    },

    fillIt: function (state) {
      this.fill = state;
      this.emitChange();
    },

    initialize: function() {
        this.logged = false;
        this.loginDetails = {};
        this.fill = false;
    },

    getState: function() {
        return {
            logged: this.logged,
            loginDetails: this.loginDetails,
            fill: this.fill
        };
    },

    handleSignup: function(details) {
        if (!details.errors) {
            this.fill = false;
            this.logged = true;
            MainLayout.initialState();
        }
        for (var key in details) {
            this.loginDetails[key] = details[key];
        }
        this.emitChange();
    },

    handleLogin: function(details) {
        if (typeof details === String) {
            this.loginDetails.error = details;
        } else {
            for (var key in details) {
                this.loginDetails[key] = details[key];
            }
            this.logged = true;
            this.fill = false;
            MainLayout.initialState();
            this.emitChange();
        }
    },

    dehydrate: function() {
        return this.getState();
    },

    rehydrate: function(details, done) {
        this.fill = details.fill;
        this.handler = details.handler;
        this.logged = details.logged;
        this.loginDetails = details.loginDetails;
        done ? done() : this.emitChange();
    }
});

module.exports = LoginStore;
