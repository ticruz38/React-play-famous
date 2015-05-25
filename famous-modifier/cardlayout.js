/*global ListLayout */
var Easing = require('famous/transitions/Easing');
var Transitionable = require('famous/transitions/Transitionable');

function Modifier() {
  this.activeState = _initialState;
  this.state = 0;
}

var transition = {
  duration: 600,
  curve: Easing.outBack
};

var color = new Transitionable(30);

function _initialState(trans) {
  var gutter = this.size[0] / 16;
  var x = this.size[0] / 8;
  this.elements.forEach(function(element, i) {
    if (!element.transitionable.initialize) {
      _initialize.call(this, element, x);
      trans = transition;
      element.transitionable.initialize = true;
    }
    element.transitionable.origin.set([0.5, 0]);
    element.transitionable.size.set([this.size[0] / 4, this.size[0] / 4], trans);
    element.transitionable.transform.setTranslate([x, 0, 0], trans);
    x += this.size[0] / 4 + gutter;
    //element._element.style.backgroundColor = 'hsl(' + color.get() + ', 75%, 50%)';
  }.bind(this));
}

function _initialize(element, x) {
  element.transitionable.size.set([0, 0]);
  element.transitionable.transform.setTranslate([x, 0, 0]);
}

function _menuState(trans) {
  this.home.transitionable.size.set([this.size[0] * 0.75, this.size[1] * 0.75], trans);
  this.home.transitionable.transform.setTranslate([(this.size[0] / 2) + (this.size[0] / 4), this.size[1] / 2, 0], trans);
  color.set(90, trans);
  this.home._element.style.backgroundColor = 'hsl(' + color.get() + ', 75%, 50%)'; //need to handle it view commit side
}

Modifier.prototype.setState = function(context, elements) {
  if (!context) return;
  this.elements = elements;
  this.size = context.size;
  this.activeState();
};

Modifier.prototype.switchState = function() {
  ListLayout.switchState();
  this.activeState = this.state ? _initialState : _menuState;
  this.state = !this.state;
  this.activeState(transition);
};

Modifier.prototype.remove = function(id, cb) {
  var element = this.elements[id];
  element.transitionable.size.set([0, 0], transition, function() {
    cb();
  });
};

module.exports = Modifier;
