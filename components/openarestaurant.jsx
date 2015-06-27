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

var field = {};


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
      console.log(transition);
      var path = new RegExp(transition.path);
      if(path.test('step')) {
        if(!component.isFilled()) transition.abort();
      }
    }
  },

  componentDidMount: function () {
  },

  isFilled: function () {
    var re = /^[a-z]{2,8}$/i;
    var node = this.getDOMNode();
    var name = node.querySelector('input#restaurant-name').value;
    var food = node.querySelector('input#food-type').value;
    if(!re.test(name) || !re.test(food)) {
      return false;
    } else {
      field.name = name;
      field.food = food;
      return true;
    }
  },

  render: function () {
    return(
      <div className = 'openarestaurant'>
        <Slide to='/open/2nd-step' from='/' title='1st Step' index = {0} description='register your business'/>
        <div className='open'>Restaurant Name<br/><input id='restaurant-name' className='open' type='text'/></div><br/>
        <div className='open'>Type of Food<br/><input id='food-type' className='open' type='text'/></div><br/>
        <div className='open'>Brief description<br/>
          <textarea id='description' className='brief-description open'>
          </textarea>
        </div><br/>
      </div>
    );
  }
});


//settle some basics settings
// Register cardlist state in that 'global' variable

var focus = {};
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

  _onChange: function () {
    var state = this.getStore(ProStore).getState();
    this.setState(state);
  },

  getInitialState: function () {
    return this.getStore(ProStore).getState();
  },

  componentDidMount: function () {
    // console.log('secondStep didmount');
  },

  add: function () {
    var item = {name: 'name', picture: '/public/icons/picture.png', childs: [], id: Math.random().toString(36).substring(7)};
    if(focus.active) item.child = true;
    this.getStore(ProStore).add(item, focus);
  },

  render: function () {
    var element = this.state.focus ? <Focus item={this.state.focus}/> : '';
    return(
      <div className='openarestaurant'>
        <Slide to='/open/3rd-step' from='/open/1st-step' title='2nd Step' index={1} description='Settle your card'/>
        <div className='plus-icon' onClick={this.add}/>
        <CardList items={this.state.items}>
        {element}
        </CardList>
      </div>
    );
  }
});
//
// var UtilityBar = React.createClass({
//
// })

var Focus = React.createClass({

  mixins: [FluxibleMixin],

  getInitialState: function () {
    this.name = false;
    this.description = false;
    var state = {
      description : this.props.item.description,
      name : this.props.item.name,
      picture: this.props.item.picture,
      id: this.props.item.id
    };
    return state;
  },

  switch: function (e, type) {
    if (type === 'name') {
      if(this.description) this.description = !this.description;
      this.name = !this.name;
    } else {
      if(this.name) this.name = !this.name;
      this.description = !this.description;
    }
    this.forceUpdate();
  },

  componentDidMount: function () {
    CardModifier.superFocus();
    CardView.add(this.getDOMNode());
  },

  onNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  onDescriptionChange: function (e) {
    this.setState({description: e.target.value});
  },

  close: function () {
    var cb = function () {
      this.getStore(ProStore).unSuperFocus(this.state);
      CardModifier.elements.pop();
    }.bind(this);
    CardModifier.unSuperFocus(cb);
  },

  render: function() {
    return (
      <div className = 'focus'>
        <span className = 'close-icon' onClick={this.close}/>
        <h1 className= {this.name ? 'hidden' : ''} onClick={function(e) {this.switch(e, 'name');}.bind(this)}>{this.state.name}</h1>
        <input className={this.name ? '' : 'hidden'} value={this.state.name} onChange={this.onNameChange} onKeyDown={function(e) {if (e.keyCode === 13) this.switch(e, 'name');}.bind(this)}/>
        <img className='focus' src={this.state.picture}></img>
        <div className='description'>
          <h2 className= {this.state.description ? 'hidden' : ''} onClick={function(e) {this.switch(e, 'description');}.bind(this)}>Click to add description</h2>
          <textarea className = {this.description ? '' : 'hidden'} onChange={this.onDescriptionChange} onKeyDown={function(e) {if (e.keyCode === 13) this.switch(e, 'description');}.bind(this)}>{this.state.description}</textarea>
          <p className = {this.description ? 'hidden' : ''} onClick={function(e) {this.switch(e, 'description');}.bind(this)}>{this.state.description}</p>
        </div>
      </div>
    );
  }
});

var ReactTransitionGroup = React.addons.TransitionGroup;

var CardModifier = require('../famous-modifier/cardlayout');
CardModifier = new CardModifier();
var CardView = null;

var CardList = React.createClass({

  componentDidMount: function () {
    console.log('cardlist mount', CardView);
    var childs = React.findDOMNode(this.refs.listcontainer).children;
    if(!CardView) {
      CardView = famousContext.add(this.getDOMNode());
      CardView.setModifier(CardModifier);
    }
    CardView.set(childs);
  },
  render: function () {
    var createItem = function(item, index) {
      return <CardItem key={item.id} index = {index} item={item}/>;
    };
    return <ReactTransitionGroup component='div' className='list-container' ref='listcontainer'>
            {this.props.items.map(createItem)}
            {this.props.children}
          </ReactTransitionGroup>;
  }
});

var CardItem = React.createClass({
  mixins: [FluxibleMixin],

  // statics: {
  //   storeListeners: {
  //     _onChange: [ProStore]
  //   },
  // },

  getInitialState: function () {
    this.props.item.hidden = true;
    this.editName = false;
    return this.props.item;
  },

  // _onChange: function () {
  //   var state = this.getStore(ProStore).getState();
  //   console.log(state);
  //   this.setState(state);
  // },

  onChange: function (e) {
    this.setState({name: e.target.value});
  },

  switch: function () {
    this.editName = ! this.editName;
    this.forceUpdate();
    var input = React.findDOMNode(this.refs.input);
    this.editName ? input.focus() : input.blur();
  },

  close: function () {
    if(!focus.active) {
      if(!this.View) return;
      this.getStore(ProStore).remove(this.props.index, focus);
    } else {
      this.getDOMNode().style.overflow = 'hidden';
      this.getDOMNode().style.backgroundColor = '';
      this.displayList = false;
      focus.active = false;
      focus.index = undefined;
      CardModifier.unFocus();
      this.forceUpdate();
    }
  },

  focus: function (e) {
    if(focus.active) return;
    var img = React.findDOMNode(this.refs.img);
    img.style.display = 'none';
    var childs = React.findDOMNode(this.refs.CardList).children;
    focus.active = true;
    focus.index = this.props.index;
    this.getDOMNode().style.overflow = 'scroll';
    this.getDOMNode().style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    CardModifier.focus(this.props.index, childs);
  },

  componentWillLeave: function (cb) {
    console.log(this.View);
    CardModifier.remove(this.View.render(), cb, CardView);
  },

  componentDidMount: function () {
    if (!CardView) return;
    console.log('carditem mount');
    this.View = CardView.add(this.getDOMNode());
  },

  componentDidUpdate: function () {
  },

  render: function () {
    return(
      <div className = 'card-item'>
      <span className = 'close-icon' onClick={this.close}/>
      <h1 className = {this.editName ? 'hidden' : ''} onClick={this.switch}>{this.state.name}</h1>
      <input className = {this.editName ? '' : 'unvisible'} ref='input' onChange={this.onChange} value={this.state.name} onKeyDown={function(e) {if (e.keyCode === 13) this.switch();}.bind(this)}/>
      <img ref='img' src={this.state.picture} onClick={this.focus}></img>
      <ChildCardList ref='CardList' items={this.state.childs}/>
      </div>
    );
  }
});

var ChildCardList = React.createClass({

  render: function () {
    var items = this.props.items ? this.props.items : [];
    var createItem = function(item, index) {
      return <ChildCardItem key={item.id} index={index} item={item}/>;
    };
    return <ReactTransitionGroup component='div' className='list-container' ref='listcontainer'>{items.map(createItem)}</ReactTransitionGroup>;
  }
});

var ChildCardItem = React.createClass({
  mixins: [FluxibleMixin],

  getInitialState: function () {
    return this.props.item;
  },

  onChange: function (e) {
    this.setState({name: e.target.value});
  },

  switch: function () {
    this.editName = ! this.editName;
    this.forceUpdate();
    var input = React.findDOMNode(this.refs.input);
    this.editName ? input.focus() : input.blur();
  },

  close: function () {
    this.getStore(ProStore).remove(this.props.index, focus);
  },

  focus: function (e) {
    e.stopPropagation();
    var path = [focus.index, this.props.index];
    this.getStore(ProStore).superFocus(this.state, path);
  },

  componentWillLeave: function (cb) {
    cb();
    CardModifier.removeChild(this.props.index);
  },

  componentDidMount: function () {
    CardModifier.child(this.getDOMNode());
  },

  // componentDidUpdate: function () {
  //   console.log('update', this.props);
  //   var item = this.props.item;
  //   this.setState(item);
  // },

  render: function () {
    return(
      <div className = 'card-item'>
      <span className = 'close-icon' onClick={this.close}/>
      <span className = {this.editName ? 'hidden' : ''} onClick={this.switch}>{this.state.name}</span>
      <input className = {this.editName ? '' : 'unvisible'} ref='input' onChange={this.onChange} value={this.state.name} onKeyDown={function(e) {if (e.keyCode === 13) this.switch();}.bind(this)}/>
      <img ref='img' src={this.state.picture} onClick={this.focus}></img>
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
    var d = 'M' + time + ',-100 v200';
    return (
    <div className='timeline'>
      <svg className= 'command' viewBox="0 -100 1440 200">
        <rect x='0' y='-100' width={this.props.time.hours * 60 + this.props.time.min} height='200' fill = 'rgba(0, 0, 0, 0.8)'/>
        <rect x={this.props.time.hours * 60 + this.props.time.min} y='-100' width={1440 - (this.props.time.hours * 60 + this.props.time.min)} height='200' fill = 'rgba(255, 255, 255, 0.8)'/>
        <path d='M0,0 H1440' stroke = 'black' strokeWidth = '1'/>
        <path className = 'cursor' d={d} stroke = 'grey' strokeWidth = '4' />
      {this.state.commands.map(createCommands)}
      </svg>
    </div>
  );
  }
});

var CommandLayout = require('../famous-modifier/commandlayout');

var Dashboard = React.createClass({

  getInitialState: function () {
    var state = {
      commands: []
    };
    return state;
  },

  onScroll: function (e, i) {
    console.log(e);
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
    var dashboardView = famousContext.add(this.getDOMNode());
    var time = this.props.time.hours * 60 + this.props.time.min;
    console.log(time*25);
    this.getDOMNode().scrollTop = time * 25;
    dashboardView.setModifier(CommandLayout);
    dashboardView.set(childs);
  },

  render: function () {
    var createCommands = function (command, index) {
      return <Command key={index} command={command}/>;
    };
    return (
    <ReactTransitionGroup component='div' className = "dashboard" onScroll = {this.onScroll}>
      {this.state.commands.map(createCommands)}
    </ReactTransitionGroup>
  );
  }
});

var Command = React.createClass({

  componentDidMount: function () {
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
