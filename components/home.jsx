/*global MainLayout, MenuLayout*/

'use strict';

var React = require('react/addons');
var AmbrosiaStore = require('../stores/AmbrosiaStore');
var AuthStore = require('../stores/authstore');
var FluxibleMixin = require('fluxible').FluxibleMixin;
var RouteHandler = require('react-router').RouteHandler;
var Navbar = require('./navbar.jsx');
//var data = require('../data/food.json');


var Home = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
      storeListeners: {
          _onChange: [AmbrosiaStore, AuthStore]
        }
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    getStateFromStores: function () {
      return {
        auth: this.getStore(AuthStore).getState()
      };
    },

    _onChange: function () {
      this.setState(this.getStateFromStores);
    },

    componentDidMount: function () {
      console.log('home');
    },

    onBurgerClicked: function () {
      console.log(event);
    },

    logStatus: function () {
    },
    render: function () {
        return (
          <div>
            <Navbar/>
            <div className='body'>
            <RouteHandler/>
            </div>
          </div>
        );
    }
});

module.exports = Home;
