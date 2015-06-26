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
var authModifier = require('../famous-modifier/authlayout');
var Easing = require('famous/transitions/Easing');

var easing = {
    duration: 600,
    curve: Easing.outBack
};

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
      console.log(authView.context.size[0]/3);
      authView.transitionable.size.set([authView.context.size[0]/3, authView.context.size[1]/3], easing);
      authView.transitionable.transform.setTranslate([authView.context.size[0]/3, authView.context.size[1]/4, 10], easing);
    },

    componentDidMount: function () {
      window.authView = famousContext.add(this.getDOMNode());
      authView.setModifier(authModifier);
      //authView.setModifier(authModifier);
      console.log(authView);
      authView.transitionable.transform.setTranslate([authView.context.size[0]- authView.context.size[0]/10, 0, 0]);
      authView.transitionable.size.set([authView.context.size[0]/12, authView.context.size[1]/10]);
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
