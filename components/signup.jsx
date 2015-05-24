/*jslint node: true */
/*global AuthView, SignupLayout, MainLayout*/
'use strict';

var signupLayout = require('../famous-modifier/signuplayout');
var AuthStore = require('../stores/authstore.js');
var AuthAction = require('../actions/auth');
var FluxibleMixin = require('fluxible').FluxibleMixin;

var React = require('react');
//var ReactTransitionGroup = React.addons.TransitionGroup;

var Signup = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
      storeListeners: {
        _onChange: [AuthStore]
      }
    },

   getInitialState: function () {
       return this.getStore(AuthStore).getState();
   },

   _onChange: function () {
     var state = this.getStore(AuthStore).getState();
     this.setState(state);
   },

   loginUi: function (e) {
     e.stopPropagation();
     this.getStore(AuthStore).authUI('login');
     MainLayout.authRotate();
   },

   componentWillLeave: function (cb) {
     SignupLayout.willUnMount(cb);
   },

   componentDidUpdate: function () {

   },

   componentDidMount: function () {
     if(!window.SignupLayout) window.SignupLayout = new signupLayout();
     var Childs = [];
     var elements = this.getDOMNode().children;
     for (var i = 0; i < elements.length; i++) {
       Childs.push(elements[i]);
     }
     AuthView.setChild(Childs);
     AuthView.setModifier(SignupLayout);
   },
   render: function() {
     var errors = this.state.loginDetails.errors;
     var emailError;
     var passwordError;
     var matchError;
     var emailUsed;
     if(errors) {
       errors.email ? emailError = <span className='error' key='mail-error'>{errors.email}</span> : emailError=null;
       errors.password ? passwordError = <span className='error' key='password-error'>{errors.password}</span> : passwordError=null;
       errors.match ? matchError = <span className='error' key='match-error'>{errors.match}</span> : matchError=null;
       errors.emailUsed ? emailUsed = <span className='error' key='mailUsed-error'>{errors.emailUsed}</span> : emailUsed=null;
     }
       return (
         <form id='signup' onSubmit={this.signup}>
           <span className='log' key='mail'>
           <label for="mail">Mail</label><br/>
             {emailError}
             {emailUsed}
           <input id='mail' key='input-mail' className='signup' type='email'/>
           </span>
           <span className='log' key='password'>
             <label for="password">Password</label><br/>
             {passwordError}
           <input id='password' key='input-password' className='signup' type= 'password'/>
           </span>
           <span className='log' key='confirmPassword'>
             <label for="confirmPassword">Confirm your Password</label><br/>
             {matchError}
             <input id='confirmPassword' key='input-confirmPassword' className='signup' type= 'password'/>
             <div className='question' onClick={this.loginUi}>allready a member?</div>
           </span>
           <input type='submit' key='submit' value='Signup' form='signup' className='log ambrosia-button'/>
         </form>
       );
   }
});

module.exports = Signup;
