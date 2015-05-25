/*global MainLayout, MenuLayout*/

'use strict';

var React = require('react/addons');
var AmbrosiaStore = require('../stores/AmbrosiaStore');
var AuthStore = require('../stores/authstore');
var Auth = require('./auth.jsx');
var FluxibleMixin = require('fluxible').FluxibleMixin;
var SvgButton = require('./svgbutton');
var Menu = require('./menu');
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

    },

    onBurgerClicked: function () {

      MenuLayout.menuState();
    },

    logStatus: function () {
      var state;
      if(this.state.auth.logged) {
        state = <span className='logged-in-button'>logged in with {this.state.auth.loginDetails.mail}</span>;
        if(this.state.auth.loginDetails.pseudo) {
          state = <span className='log'>Welcome {this.state.auth.loginDetails.pseudo}</span>;
            if(this.state.auth.loginDetails.picture) {
              state = <div className='profile'>
                        <span className='log'>logged in as {this.state.auth.loginDetails.pseudo}</span>
                        <img src={this.state.auth.loginDetails.picture}/>
                      </div>;
            }
        }
      } else {
          state = null;
        }
      return state;
    },
    render: function () {
        return (
          <div>
            <div className='home-page famous-surface'>
              <h1 className='ambrosia famous-surface'>Ambrosia</h1>
              <SvgButton/>
              <Auth/>
              <div className='body'>
              <RouteHandler/>
              </div>
            </div>
            <Menu/>
          </div>
        );
    }
});

module.exports = Home;
