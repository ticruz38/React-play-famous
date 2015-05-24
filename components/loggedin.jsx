/*global*/
'use strict';

var AuthStore = require('../stores/authstore.js');
var FluxibleMixin = require('fluxible').FluxibleMixin;

var React = require('react');

var LoggedIn = React.createClass({
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

   logout: function () {
     this.context.executeAction('signout');
   },


   componentDidMount: function () {
   },

   render: function() {
     var state = <span>logged in with {this.state.loginDetails.mail}</span>;
     var pics;

     if(this.state.loginDetails.pseudo) {
       state = <span>Welcome {this.state.loginDetails.pseudo}</span>;
     }
     if(this.state.loginDetails.picture) {
       pics = <img src = {this.state.loginDetails.picture}/>;
     }
     return (
       <div>
         {pics}
         {state}
         <span className='logout-icon' onClick={this.logout}/>
       </div>
     );

   }
});

module.exports = LoggedIn;
