/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
 /*jslint node: true */
 /*global AuthView, MainLayout*/
 'use strict';

var FormLayout = require('../famous-modifier/authlayout');
FormLayout = new FormLayout();
var AuthAction = require('../actions/auth');
var AuthStore = require('../stores/authstore.js');
var FluxibleMixin = require('fluxible').FluxibleMixin;

var React = require('react');

var Login = React.createClass({
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

    switch: function (e) { //switch and rotate the authwindow
      FormLayout.switchState();
    },

    close: function () {
      this.getStore(AuthStore).fillIt(false);
      MainLayout.searchState();
    },

    login: function (e) {
      e.preventDefault();
      var details = {};
      details.form = e.target.id;
      var el = e.target.getElementsByTagName('INPUT');
      for(var i=0; i<el.length-1; i++) { //el.length-1 to pass the last input which is the submit button
        details[el[i].id] = el[i].value;
      }
      this.context.executeAction(AuthAction, details);
    },

    signup: function (e) {
      e.preventDefault();
      var details = {};
      details.form = e.target.id;
      var el = e.target.getElementsByTagName('INPUT');
      for(var i=0; i<el.length; i++) {
        details[el[i].id] = el[i].value;
      }
      this.context.executeAction(AuthAction, details);
    },


    componentDidMount: function () {
      var View = require('../famous-helpers/view');
      var FormView = new View({
        element: document.querySelector('.form')
      });
      AuthView.setChild(FormView);
      FormView.setChild([document.querySelector('#signup'), document.querySelector('#login')]);
      FormView.setModifier(FormLayout);
    },

    render: function() {
      var errors;
      if(this.state.loginDetails) errors = this.state.loginDetails.errors;
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
      <div className='form'>
        <form id='signup' onSubmit={this.signup}>
          <span className='close-icon' onClick={this.close}/>
          <span className='log' key='mail'>
          Mail<br/>
            {emailError}
            {emailUsed}
          <input id='mail' key='input-mail' className='signup' type='email'/>
          </span><br/>
          <span className='log' key='password'>
          Password<br/>
            {passwordError}
          <input id='password' key='input-password' className='signup' type= 'password'/>
          </span><br/>
          <span className='log' key='confirmPassword'>
            <label for="confirmPassword">Confirm your Password</label><br/>
            {matchError}
            <input id='confirmPassword' key='input-confirmPassword' className='signup' type= 'password'/>
            <div className='question' onClick={this.switch}>allready a member?</div>
          </span><br/>
          <input type='submit' key='submit' value='Signup' form='signup' className='submit'/>
        </form>
      <form id='login' onSubmit={this.login}>
        <span className='close-icon' onClick={this.close}/>
        <div className='social' ref='fb'><span className='facebook-icon'/>Sign in with facebook</div>
        <br/>
        <span className='log' ref='pseudo'>
          Pseudo<br/>
          <input id='pseudo' ref ='pseudo-input' className='login' type= 'text'/>
        </span><br/>
        <span className='log' ref='password'>
          Password<br/>
          <input id='password' ref='password-input' className='login' type= 'password'/>
          <div className='question' onClick={this.switch}>not a member yet?</div>
        </span><br/>
      <input type='submit' value='Log-In' form='login' className='submit'/>
      </form>
    </div>
    );
  }
});

module.exports = Login;
