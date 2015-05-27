/*global MainLayout, BodyView*/
'use strict';

var React = require('react/addons');
var ProStore = require('../stores/prostore');
var AuthStore = require('../stores/authstore');
var FluxibleMixin = require('fluxible').FluxibleMixin;
var RouteHandler = require('react-router').RouteHandler;
var Link = require('react-router').Link;
// var Auth = require('./auth');
// var SvgButton = require('./svgbutton');
// var Menu = require('./menu');
// var AuthAction = require('../actions/auth');
// var RouteHandler = require('react-router').RouteHandler;

//var data = require('../data/food.json');

var field = {};


var Open = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
      storeListeners: {
          _onChange: [AuthStore]
        }
    },

    getInitialState: function () {
        return this.getStore(AuthStore).getState();

    },

    getStateFromStores: function () {
      return {
      };
    },

    _onChange: function () {
      this.setState(this.getStateFromStores);
    },

    open: function (e) {
      e.preventDefault();
      // var details = {};
      // var el = e.target.getElementsByClassName('open');

    },

    componentDidMount: function () {
      // if(!this.state.logged) {
      //   MainLayout.AuthState();
      //   this.getStore(AuthStore).fillIt(true);
      // }
    },

    render: function () {
      var handler =
      <div className='openarestaurant'>
        <div className='container'>
          <Link to='/open/1st-step' className='item'>
            <h2>1st Step</h2>
            <p>Register your business</p>
          </Link>
          <Link to='/open/2nd-step' className='item'>
            <h2>2nd Step</h2>
            <p>Settle your card</p>
          </Link>
        </div>
        <RouteHandler/>
      </div>;
      // if(!this.state.logged) {
      //   handler = <div className='open'>You need to login yourself first</div>;
      // }
        return (
          handler
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
    MainLayout.initialState();
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
      <div>
        <span className='open'>Restaurant Name<br/><input id='restaurant-name' className='open' type='text'/></span><br/>
        <span className='open'>Type of Food<br/><input id='food-type' className='open' type='text'/></span><br/>
        <span className='open'>Brief description<br/>
          <textarea id='description' className='brief-description open'>
          </textarea>
        </span><br/>
      <Link className='button' to='/open/2nd-step'>Next Step</Link>
      </div>
    );
  }
});


//settle some basics settings

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
      console.log('transitionfrom 2nd step', transition, component);
    }
  },

  _onChange: function () {
    var state = this.getStore(ProStore).getState();
    this.setState(state);
  },

  getInitialState: function () {
    console.log(this.getStore(ProStore).getState());
    return this.getStore(ProStore).getState();
  },

  componentDidMount: function () {
    MainLayout.bigState();
  },

  add: function () {
    var item = {name: 'name', picture: '/public/icons/picture.png', id: Math.random().toString(36).substring(7)};
    this.getStore(ProStore).add(item);
  },

  render: function () {
    return(
      <div>
        <div className='plus-icon' onClick={this.add}/>
        <RouteHandler items={this.state.items}/>
      </div>
    );
  }
});

var ReactTransitionGroup = React.addons.TransitionGroup;

var CardModifier = require('../famous-modifier/cardlayout');
CardModifier = new CardModifier();

Open.cardList = React.createClass({

  componentDidMount: function () {
    var childs = React.findDOMNode(this.refs.listcontainer).children;
    BodyView.setChild(childs);
    BodyView.setModifier(CardModifier);
  },
  render: function () {
    var createItem = function(item, index) {
      return <CardItem key={item.id} index = {index} item={item}/>;
    };
    return <ReactTransitionGroup component='div' className='list-container' ref='listcontainer'>{this.props.items.map(createItem)}</ReactTransitionGroup>;
  }
});

var CardList = React.createClass({

  statics: {
    // mount: function () {
    //   var childs = React.findDOMNode('.list-container').children;
    //   console.log(childs);
    //   CardModifier.child(childs);
    // }
  },

  componentDidMount: function () {
    // var childs = React.findDOMNode(this.refs.listcontainer).children;
    // console.log(childs);
    // CardModifier.child(childs);
    // BodyView.setChild(childs);
    // BodyView.setModifier(CardModifier);
  },
  render: function () {
    var createItem = function(item, index) {
      return <CardItem key={item.id} index = {index} item={item}/>;
    };
    return <ReactTransitionGroup component='div' className='list-container' ref='listcontainer'>{this.props.items.map(createItem)}</ReactTransitionGroup>;
  }
});

var CardItem = React.createClass({
  mixins: [FluxibleMixin],

  getInitialState: function () {
    this.child = undefined;
    this.props.item.hidden = true;
    this.props.item.children = [];
    return this.props.item;
  },

  onChange: function (e) {
    this.setState({name: e.target.value});
  },

  switch: function () {
    this.state.hidden = ! this.state.hidden;
    this.setState({hidden: this.state.hidden});
    var input = React.findDOMNode(this.refs.input);
    this.state.hidden ? input.blur() : input.focus();
  },

  close: function () {
    this.getStore(ProStore).remove(this.props.index);
  },

  focus: function () {
    var img = React.findDOMNode(this.refs.img);
    img.style.display = 'none';
    var item = {name: 'name', child: true, picture: '/public/icons/picture.png', id: Math.random().toString(36).substring(7)};
    this.setState({children: [item]});
    CardModifier.focus(this.props.index);
    this.child = function () {
      var childs = React.findDOMNode(this.refs.CardList).children;
      CardModifier.child(childs);
    }.bind(this);
  },

  componentWillLeave: function (cb) {
    CardModifier.remove(this.props.index, cb, BodyView);
    //BodyView.removeChild(this.props.index);
  },

  componentDidMount: function () {
    if(!this.props.item.child) BodyView.setChild(this.getDOMNode());
  },

  componentDidUpdate: function () {
    if(this.child) this.child()
  },

  render: function () {
    return(
      <div className = 'card-item'>
      <span className = 'close-icon' onClick={this.close}/>
      <span className = {this.state.hidden ? '' : 'hidden'} onClick={this.switch}>{this.state.name}</span>
      <input className = {this.state.hidden ? 'unvisible' : ''} ref='input' onChange={this.onChange} value={this.state.name} onKeyDown={function(e) {if (e.keyCode === 13) this.switch();}.bind(this)}/>
      <img ref='img' src={this.state.picture} onClick={this.focus}></img>
      <CardList ref='CardList' items={this.state.children}/>
      </div>
    );
  }
});

Open.thirdStep = React.createClass({
  render: function () {
    return(
      <div></div>
    );
  }
});

module.exports = Open;
