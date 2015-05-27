var Easing = require('famous/transitions/Easing');

function Modifier() {
  this.focusElement = undefined;
  this.elements = [];
  this.activeState = _initialState;
  this.state = 0;
}

var transition = {
  duration: 400,
  curve: Easing.outBack
};

function _initialState(trans) {
  var gutter = this.size[0] / 16;
  var x = this.size[0] / 8;
  var y = 0;
  var height = this.elements[0]._element.clientHeight;
  this.elements.forEach(function(element, i) {
    if (!element.transitionable.initialize) {
      _initialize.call(this, element, x);
      trans = transition;
      element.transitionable.initialize = true;
    }
    element.transitionable.origin.set([0.5, 0]);
    element.transitionable.size.set([this.size[0] / 4, height], trans);
    element.transitionable.transform.setTranslate([x, y, 0], trans);
    x += this.size[0] / 4 + gutter;
    if(x > this.size[0]) {
      y += height + gutter;
      x = this.size[0] / 8;
    }
    //element._element.style.backgroundColor = 'hsl(' + color.get() + ', 75%, 50%)';
  }.bind(this));
}

function _initialize(element, x) {
  element.transitionable.size.set([0, 0]);
  element.transitionable.transform.setTranslate([x, 0, 0]);
}

Modifier.prototype.setState = function(context, elements) {
  if (!context) return;
  this.size = context.size;
  var trans = (this.elements.length != elements.length) ? transition : null;
  this.elements = elements;
  this.activeState(trans);
};


Modifier.prototype.remove = function(id, cb, view) {
  var element = this.elements[id];
  element.transitionable.opacity.set(0, transition);
  element.transitionable.size.set([0, 0], transition, function () {
    cb();
    view.removeChild(id);
  });
};

Modifier.prototype.focus = function (id) {
  this.focusElement = this.elements[id];
  var height = this.focusElement._element.clientHeight;
  this.focusElement.transitionable.size.set([this.size[0] * 0.75 , 2 * height], transition);
  this.focusElement.transitionable.transform.setTranslate([this.size[0]/2, 0, 10], transition);
};

Modifier.prototype.child = function (childs) {
  console.log(childs.length, this.focusElement);
  if(!this.focusElement) return;
  this.focusElement.testChild(childs);
  this.focusElement.setModifier(Modifier);
};

module.exports = Modifier;
