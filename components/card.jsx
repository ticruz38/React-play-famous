'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').FluxibleMixin;
var ProStore = require('../stores/prostore');

var Card = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
      storeListeners: {
        _onChange: [ProStore]
      }
    },
    _onChange: function () {
      var state = this.getStore(ProStore).getState();
      this.setState(state);
    },
    getInitialState: function() {
      return this.getStore(ProStore).getState();
    },
    add: function() {
      var item = {name: 'name', picture: '/public/icons/picture.png', childs: [], id: Math.random().toString(36).substring(7)};
      if(focus.active) item.child = true;
      this.getStore(ProStore).add(item, focus);
    },
    render: function() {
      var element = this.state.focus ? <Focus item={this.state.focus}/> : '';
      return (
      <div className='card'>
      <div className='plus-icon' onClick={this.add}/>
      <CardList items={this.state.items}>
      {element}
      </CardList>
      </div>
    );
    }
});

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

module.exports = Card;
