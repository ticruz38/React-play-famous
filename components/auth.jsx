/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
 /*jslint node: true */
 /*global MainLayout*/
'use strict';
var React = require('react');
var ReactTransitionGroup = React.addons.TransitionGroup;
var AuthStore = require('../stores/authstore.js');
var Login = require('./login');
var loggedIn = require('./loggedIn');

var FluxibleMixin = require('fluxible').FluxibleMixin;

var Auth = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: {
          _onChange: [AuthStore]
        },
    },

    getInitialState: function () {
        var state = this.getStore(AuthStore).getState();
        return state;
    },

    _onChange: function () {
      var state = this.getStore(AuthStore).getState();
      this.setState(state);
    },

    fill: function () {
      this.getStore(AuthStore).fillIt(true);
      MainLayout.AuthState();
    },


    componentDidMount: function () {
    },

    render: function() {
      var signup = this.state.fill ? <Login/> : <span className='button' onClick={this.fill}>Signup</span>;
      var handler = this.state.logged ? <loggedIn/> : {signup};
        return (
          <div className='auth'>
            {handler}
          </div>
        );
    }

});

module.exports = Auth;
