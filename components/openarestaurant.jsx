/*global MainLayout, BodyView*/
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


var Open = React.createClass({

    mixins: [FluxibleMixin, Router.State],

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

    getSlide: function () {
      console.log(this.getPath());
    },

    componentDidMount: function () {
      // if(!this.state.logged) {
      //   MainLayout.AuthState();
      //   this.getStore(AuthStore).fillIt(true);
      // }
    },

    render: function () {
      this.getSlide();
      return (
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
      </div>
    );
  }
});

var Slide = React.createClass({

  render: function() {
    return (
    <div className='container'>
      <Link to={this.props.from} className={this.props.from ? 'from' : 'hidden'}>
        <svg className = "arrow left" viewBox="0 0 60 60">
          <path d='M60,0 L25,30 L60,60' stroke='white' strokeWidth='4' strokeLinecap='round' fill="none"/>
        </svg>
      </Link>
      <h2>{this.props.title}</h2>
      <p>{this.props.description}</p>
      <svg className = 'pointer'viewBox="0 0 60 20">
        <circle cx = '10' cy = "10" r = "7" stroke="white" strokeWidth="0.5" fill = {this.props.index === 0 ? 'white' : 'none'}/>
        <circle cx = '30' cy = "10" r = "7" stroke="white" strokeWidth="0.5" fill = {this.props.index === 1 ? 'white' : 'none'}/>
        <circle cx = '50' cy = "10" r = "7" stroke="white" strokeWidth="0.5" fill = {this.props.index === 2 ? 'white' : 'none'}/>
      </svg>
      <Link to={this.props.to} className={this.props.to ? 'to' : 'hidden'}>
        <svg className = 'arrow right' viewBox="0 0 60 60">
          <path d='M0,0 L35,30 L0,60' stroke='white' strokeWidth='4' strokeLinecap='round' fill="none"/>
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
    MainLayout.bigState();
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
    BodyView.setChild(this.getDOMNode());
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

var CardList = React.createClass({

  componentDidMount: function () {
    var childs = React.findDOMNode(this.refs.listcontainer).children;
    console.log(childs);
    BodyView.setChild(childs);
    BodyView.setModifier(CardModifier);
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
      this.getStore(ProStore).remove(this.props.index, focus);
    } else {
      this.getDOMNode().style.overflow = 'hidden';
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
    CardModifier.focus(this.props.index, childs);
  },

  componentWillLeave: function (cb) {
    CardModifier.remove(this.props.index, cb, BodyView);
  },

  componentDidMount: function () {
    BodyView.setChild(this.getDOMNode());
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

  render: function () {
    return(
      <div></div>
    );
  }
});

module.exports = Open;
