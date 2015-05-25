/*global MainLayout */

'use strict';

var React = require('react/addons');
var Link = require('react-router').Link;
// var AmbrosiaStore = require('../stores/AmbrosiaStore');
var AuthStore = require('../stores/authstore.js');
// var Auth = require('./auth.jsx');
var FluxibleMixin = require('fluxible').FluxibleMixin;

var Pro = React.createClass({
  mixins: [FluxibleMixin],

  statics: {
  },

  componentDidMount: function () {
    this.getStore(AuthStore).fillIt(false);
    MainLayout.searchState();
  },

  getInitialState: function () {
    return this.getStore(AuthStore).getState();
  },

  render: function () {
    return (
      <div id ='pro'>
          <h1 className='pro'>Ambrosia is made for pros like you</h1>
          <p>
            Ambrosia will help you in your everyday task as a chief.
            The app can be divided in three parts: <br/>
          - The Public Room or Card.<br/>
          - Your order Board.<br/>
          - Your account, you will see everything about your business here.
          </p>

          <h3><Link to='/card'>The Public Room or Card</Link></h3>
          <p>The public room let you update your card as you go<br/>
          This is very easy and funny to use.
          Clients can order your product and see every kind of useful information about you.
          Be careful with your public room, put great pictures on it, and make it attractive so people
          will order and have a great time visiting your public room!
          </p>

          <h3><Link to='/board'>The order Board</Link></h3>
          <p>The order board is your everyday friend, you can track your order as clients command,
            you see what's payed and what's not, no need to anspher the phone, people order and pay
            right from their devices.
            You can customize it with your settings, 5 minutes for a pizzas, 3 for a burger, no more
            evil calculation, you will allways be right in time when your clients arrive!
          </p>

          <h3>Your Account</h3>
          <p>The place where you can see every useful information about you restaurant.
            How many pizzas did I sold today? How is my turnover? and my earnings today? for the last month? year?
            did my clients likes my last meals? Should I put more gherkin in my Burger? Is my public room often visited ?
             You will have all the answer you want and dream off.
            This is an awesome tool that give you an overview of your business and help you in your path
            to allways make it better!
          </p>

          <Link className='button' to='openarestaurant'>Open a Restaurant</Link>
      </div>
    );
  }
});

module.exports = Pro;
