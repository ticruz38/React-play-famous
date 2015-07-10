/*global famousContext*/
'use strict';

var React = require('react/addons');
var ProStore = require('../stores/prostore');
var AuthStore = require('../stores/authstore');
var FluxibleMixin = require('fluxible').FluxibleMixin;
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
// var Auth = require('./auth');
// var SvgButton = require('./svgbutton');
// var Menu = require('./menu');
// var AuthAction = require('../actions/auth');
// var RouteHandler = require('react-router').RouteHandler;

//var data = require('../data/food.json');

let field = {};

let error = {};

var Open = {};

var Slide = React.createClass({

  render: function() {
    return (
    <div className='slide'>
      <Link to={this.props.from} className={this.props.from ? 'from' : 'hidden'}>
        <svg className = "arrow left" viewBox="0 0 60 60">
          <path d='M60,0 L25,30 L60,60' stroke='black' strokeWidth='4' strokeLinecap='round' fill="none"/>
        </svg>
      </Link>
      <h2>{this.props.title}</h2>
      <p>{this.props.description}</p>
      <svg className = 'pointer'viewBox="0 0 60 20">
        <circle cx = '10' cy = "10" r = "7" stroke="black" strokeWidth="0.5" fill = {this.props.index === 0 ? 'black' : 'none'}/>
        <circle cx = '30' cy = "10" r = "7" stroke="black" strokeWidth="0.5" fill = {this.props.index === 1 ? 'black' : 'none'}/>
        <circle cx = '50' cy = "10" r = "7" stroke="black" strokeWidth="0.5" fill = {this.props.index === 2 ? 'black' : 'none'}/>
      </svg>
      <Link to={this.props.to} className={this.props.to ? 'to' : 'hidden'}>
        <svg className = 'arrow right' viewBox="0 0 60 60">
          <path d='M0,0 L35,30 L0,60' stroke='black' strokeWidth='4' strokeLinecap='round' fill="none"/>
        </svg>
      </Link>
    </div>
  );
  }
});

//Settle the name of restaurant and basic description

Open.firstStep = React.createClass({
  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      console.log('transitionTo 1st step', transition);
      callback();
    },
    willTransitionFrom: function (transition, component) {
      var path = new RegExp(transition.path);
      if(path.test('/open/2nd-step')) {
        if(!component.isFilled()) transition.abort();
      }
    }
  },

  mixins: [FluxibleMixin],

  getInitialState: function () {
    return this.getStore(ProStore).getState();
  },

  componentDidMount: function () {
  },

  isFilled: function () {
    var re = /^[a-z]{2,8}$/i;
    var node = this.getDOMNode();
    const name = node.querySelector('input#restaurant-name').value;
    const genre = node.querySelector('input#food-type').value;
    const description = node.querySelector('textarea#description').value;
    if(!re.test(name)) {
      error.name = <div className='error'>your restaurant name should contain between 2 and 20 letters</div>;
      error.type = undefined;
      if(!re.test(genre)) {
        error.type = <div className='error'>please write a type for your restaurant</div>;
      }
      this.forceUpdate();
      return false;
    } else if (!re.test(genre)) {
      error.name = undefined;
      error.type = <div className='error'>please write a type for your restaurant</div>;
      this.forceUpdate();
      return false;
    } else {
      error = {};
      this.getStore(ProStore).credential({name: name, genre: genre, description: description});
      return true;
    }
  },

  fill: function (event, key) {
    this.state.credentials[key] = event.target.value;
    this.forceUpdate();
  },

  render: function () {
    const credentials = this.state.credentials;
    return(
      <div className = 'openarestaurant'>
        <Slide to='/open/2nd-step' from='/' title='1st Step' index = {0} description='register your business'/>
        <div className='open'>Restaurant Name<br/>
        {error.name}
        <input id='restaurant-name' className='open' type='text' onChange={function(e) {this.fill(e, 'name')}.bind(this)} value={credentials.name}/></div><br/>
        <div className='open'>Type of Food<br/>
        {error.type}
        <input id='food-type' className='open' type='text' onChange={function(e) {this.fill(e, 'genre')}.bind(this)} value={credentials.genre}/></div><br/>
        <div className='open'>Brief description<br/>
          <textarea id='description' className='brief-description open' onChange={function(e) {this.fill(e, 'description')}.bind(this)}>
            {credentials.description}
          </textarea>
        </div><br/>
      </div>
    );
  }
});

var Card = require('./card.jsx');

var focus = {}; // Register cardlist state in that 'global' variable
focus.active = false;

Open.secondStep = React.createClass({
  mixins: [FluxibleMixin],

  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      callback();
    },
    willTransitionFrom: function (transition, component) {
      // if (transition.path === '/open/3rd-step') {
      //   component.getS
      // }
      //component.executeAction('')
      //console.log('transitionfrom 2nd step', transition, component.getStore(ProStore));
    }
  },

  componentDidMount: function () {
    // console.log('secondStep didmount');
  },

  render: function () {
    return(
      <div className='openarestaurant'>
        <Slide to='/open/3rd-step' from='/open/1st-step' title='2nd Step' index={1} description='Settle your card'/>
        <Card/>
      </div>
    );
  }
});

var Board = require('./board.jsx');

Open.thirdStep = React.createClass({
  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      callback();
    },
    willTransitionFrom: function (transition, component) {

    }
  },

  getInitialState: function () {
    var d = new Date();
    var state = {
      commands: [],
      hours: d.getHours(),
      min: d.getMinutes(),
      sec: d.getSeconds(),
    };
    return state;
  },

  componentDidMount: function () {
  },

  render: function () {
    return(
      <div className = 'openarestaurant third'>
        <Slide to='/home' from='/open/2nd-step' title='3rd Step' index= {2} description = 'Here is your dashboard'/>
        <div>
          <Board/>
        </div>
      </div>
    );
  }
});

var fake = function () {
  var fakeCommands = [];
  for (var i = 0; i < 40; i++) {
    var co = {
      duration: Math.floor((Math.random() * 5) + 1),
      price: Math.floor((Math.random() * 40) + 1),
      time: Math.floor((Math.random() * 1440) + 1),
      details: [{name:'burger', picture:'public/images/burger.jpg'}, {name:'drink', picture:'public/images/drink.jpg'}],
      payed: i % 3 ? true : false
    };
    fakeCommands.push(co);
  }
  return fakeCommands;
};

var commands = fake();

module.exports = Open;
