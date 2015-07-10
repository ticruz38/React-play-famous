'use strict';

var React = require('react');
var ProStore = require('../stores/prostore');
var FluxibleMixin = require('fluxible').FluxibleMixin;

var commands = [];

var Board = React.createClass({

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: {

    }
  },

  getInitialState: function () {
    return this.getStore(ProStore).getState();
  },

  render: function () {
    return (
      <div className='board'>
        <TimeLine/>
        <Dashboard/>
      </div>
    );
  }

});

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
    <div className = "dashboard" onWheel = {this.onScroll}>
      <div className = 'container'>
      {this.state.commands.map(createCommands)}
      </div>
    </div>
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

module.exports = Board;
