/*global MainLayout, MenuLayout*/

'use strict';

var React = require('react/addons');
var AmbrosiaStore = require('../stores/AmbrosiaStore');
var AuthStore = require('../stores/authstore');
var Auth = require('./auth.jsx');
var FluxibleMixin = require('fluxible').FluxibleMixin;
var SvgButton = require('./svgbutton.jsx');
//var AuthAction = require('../actions/auth');
var RouteHandler = require('react-router').RouteHandler;

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
            <div className = 'navbar'>
              <SvgButton/>
              <h1 className='ambrosia'>Ambrosia</h1>
              <Auth/>
            </div>
            <div className='body'>
            <RouteHandler/>
            </div>
          </div>
        );
    }
});

module.exports = Home;
