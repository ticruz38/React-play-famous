
var OptionsManager = require('famous/core/OptionsManager');


var transition = {
    duration: 600,
    curve: 'easeInOut'
};

function Modifier(options) {
  this.options = Object.create(Modifier.DEFAULT_OPTIONS);
  this.optionsManager = new OptionsManager(this.options);
  if(options) this.setOptions(options);
  this.activeState = _initialState;
  this.initialized = false;
}

Modifier.DEFAULT_OPTIONS = {};

function _endState(trans) {
  var self = this;
  var y = this.context.size[1]/3; //start the list from 1/3 height of the window
  this.elements.forEach(function(element, i) {
    var height = self.context.size[1]/9;
    element.transitionable.transform.setTranslate([0, y, 0], trans);
    element.transitionable.size.set([self.context.size[0]/4, height], trans);
    element.transitionable.fontSize.set(height/2, trans);
    y += height;
  });
}

function _initialState(trans) {
  this.elements.forEach(function(element, i) {
    element.transitionable.transform.setTranslate([0, 0, 0], trans);
    element.transitionable.size.set([0, 0], trans);
    element.transitionable.fontSize.set(0, trans);
  });
}

Modifier.prototype.setState = function (context, elements, trans) {
  if(!context) return;
  this.context = context;
  this.elements = elements;
  this.activeState();
};

Modifier.prototype.switchState = function () {
  this.initialized ? this.activeState = _initialState : this.activeState = _endState;
  this.initialized = ! this.initialized;
  this.activeState(transition);
};

module.exports = Modifier;
