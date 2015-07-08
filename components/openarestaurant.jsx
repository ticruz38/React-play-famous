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
      console.log('transitionTo 1ssssst step', transition);
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
    console.log('componentDidMount');
  },

  isFilled: function () {
    var re = /^[a-z]{2,8}$/i;
    var node = this.getDOMNode();
    const name = node.querySelector('input#restaurant-name').value;
    const food = node.querySelector('input#food-type').value;
    const description = node.querySelector('textarea#brief-description').value;
    if(!re.test(name)) {
      error.name = <div className='error'>your restaurant name should contain between 2 and 20 letters</div>;
      error.type = undefined;
      if(!re.test(food)) {
        error.type = <div className='error'>please write a type for your restaurant</div>;
      }
      this.forceUpdate();
      return false;
    } else if (!re.test(food)) {
      error.name = undefined;
      error.type = <div className='error'>please write a type for your restaurant</div>;
      this.forceUpdate();
      return false;
    } else {
      error = {};
      this.getStore(ProStore).credentials({name: name, food: food, description: description});
      return true;
    }
  },

  render: function () {
    const credentials = this.state.credentials;
    console.log('render', credentials);
    return(
      <div className = 'openarestaurant'>
        <Slide to='/open/2nd-step' from='/' title='1st Step' index = {0} description='register your business'/>
        <div className='open'>Restaurant Name<br/>
        {error.name}
        <input id='restaurant-name' className='open' type='text' value={credentials.name}/></div><br/>
        <div className='open'>Type of Food<br/>
        {error.type}
        <input id='food-type' className='open' type='text' value={credentials.genre}/></div><br/>
        <div className='open'>Brief description<br/>
          <textarea id='description' className='brief-description open'>
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
    storeListeners: {
      _onChange: [ProStore]
    },
    willTransitionTo: function (transition, params, query, callback) {
      callback();
    },
    willTransitionFrom: function (transition, component) {
      // if (transition.path === '/open/3rd-step') {
      //   component.getS
      // }
      //component.executeAction('')
      console.log('transitionfrom 2nd step', transition, component.getStore(ProStore));
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
        <Slide to='/' from='/open/2nd-step' title='3rd Step' index= {2} description = 'Here is your dashboard'/>
        <div>
          <TimeLine time = {this.state}/>
          <Dashboard time = {this.state}/>
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

var TimeLine = React.createClass({

  mixins: [FluxibleMixin],

  onWheel: function (event) {
    event.preventDefault();
    dashboardView.modifier.updateX(event.deltaX / 2);
  },

  onClick: function (event) {
    var margin = 8;
    var width = this.getDOMNode().clientWidth;
    var x = ((event.clientX - margin) / width) * 1440;
    dashboardView.modifier.setX(x);
    console.log(width, event.clientX, event.pageX);
  },

  componentWillMount: function () {
    this.setState({commands: commands});
  },

  render: function () {
    var createCommands = function (command) {
      return (
          <rect x={command.time} y={command.payed ? -command.price : 0} height={command.price} width={command.duration} fill ='red'/>
      );
    };
    var time = this.props.time.hours * 60 + this.props.time.min;
    console.log(this.props);
    return (
    <div className='timeline'>
      <svg className= 'command' viewBox="0 -100 1440 200" onWheel = {this.onWheel} onClick = {this.onClick}>
        <rect x='0' y='-100' width={time} height='200' fill = 'rgba(0, 0, 0, 0.8)'/>
        <rect x={this.props.time.hours * 60 + this.props.time.min} y='-100' width={1440 - (this.props.time.hours * 60 + this.props.time.min)} height='200' fill = 'rgba(255, 255, 255, 0.8)'/>
        <path d='M0,0 H1440' stroke = 'black' strokeWidth = '1'/>
        <rect className = 'cursor' x={time} y='-100' width='20' height='200' fill = 'grey'/>
      {this.state.commands.map(createCommands)}
      </svg>
    </div>
  );
  }
});

var CommandLayout = require('../famous-modifier/commandlayout');

var dashboardView;

var Dashboard = React.createClass({

  getInitialState: function () {
    var state = {
      commands: []
    };
    return state;
  },

  onScroll: function (event) {
    event.preventDefault();
    dashboardView.modifier.update(event.deltaY);
  },

  componentWillMount: function () {
    var com = commands.sort(function(a, b) {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
    });
    this.setState({commands: com});
  },

  componentDidMount: function () {
    var childs = this.getDOMNode().children;
    dashboardView = famousContext.add(this.getDOMNode());
    var time = this.props.time.hours * 60 + this.props.time.min;
    //this.getDOMNode().scrollTop = time * 25;
    this.getDOMNode().style.top = document.querySelector("#app").clientHeight + 25;
    dashboardView.setModifier(CommandLayout);
    dashboardView.set(childs);
    //dashboardView.transitionable.transform.setTranslate([0, time*25, 0]);
    dashboardView.modifier.set(time * 25);
  },

  render: function () {
    var createCommands = function (command, index) {
      return <Command key={index} command={command}/>;
    };
    return (
    <ReactTransitionGroup component='div' className = "dashboard" onWheel = {this.onScroll}>
      <div className = 'container'>
      {this.state.commands.map(createCommands)}
      </div>
    </ReactTransitionGroup>
  );
  }
});

var Command = React.createClass({

  componentDidMount: function () {
    var time = this.getDOMNode().getAttribute('data-time');
    this.getDOMNode().style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, '+time * 25+', 0, 1)';
  },
  render: function () {
    var co = this.props.command;
    var createDetail = function (detail) {
      return (
        <div className = 'detail'>
          <img src='detail.picture'/>
          {detail.name}
        </div>
      );
    };
    var getTime = function(time) {
      var hours = Math.floor(time/60);
      var min = Math.round((time/60 - hours) * 60);
      min = min < 10 ? '0' + min : min;
      return hours < 12 ? hours + ':' + min + 'AM' :  hours + ':' + min + 'PM';
    };
    return (
      <div className = 'command' data-time = {co.time}>
        <h1>Mr Dupond<span className='price'>{co.price + ' BitCoin'}</span><span className='time'>{getTime(co.time)}</span></h1>
        <div className = 'details'>
          {co.details.map(createDetail)}
        </div>
      </div>
    );
  }
});

module.exports = Open;
