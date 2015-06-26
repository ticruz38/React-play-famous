var Easing = require('famous/transitions/Easing');
var x, y;

function Modifier(options) {
  this.focusElement = undefined;
  this.elements = [];
  this.activeState = _initialState;
  this.state = 0;
  if(options) this.options = options;
}

var rotate = {
  duration: 600,
  curve: Easing.inOutCirc
};
var transition = {
  duration: 400,
  curve: Easing.outBack
};

function _initialState(trans) {
  var gutter = this.size[0] / 10;
  x = 0;
  y = 0;
  var height = this.options ? this.size[1] * this.options.height : this.size[1]/4;
  this.elements.forEach(function(element, i) {
    if(!element.initialize) _initialize(element);
    element.transitionable.origin.set([0.5, 0]);
    element.transitionable.size.set([this.size[0] / 4, height], trans);
    element.transitionable.transform.setTranslate([x, y, 0], trans);
    x += this.size[0] / 4 + gutter;
    if (x >= this.size[0] - gutter) {
      y += height + gutter;
      x = 0;
    }
    //element._element.style.backgroundColor = 'hsl(' + color.get() + ', 75%, 50%)';
  }.bind(this));
}

function _initialize(element) {
  element.transitionable.size.set([0, 0]);
  element.transitionable.transform.setTranslate([0, 0, 0]);
  element.transitionable.transform.setRotate([0, 0, 0]);
  element.initialize = true;
}

Modifier.prototype.setState = function(context, elements) {
  if (!context) return;
  console.log(context, elements.length);
  this.size = context;
  var trans = (this.elements.length !== this.length) ? transition : null;
  this.elements = elements;
  this.length = this.elements.length;
  this.activeState(trans);
};


Modifier.prototype.remove = function(id, cb, view) {
    cb();
    view.remove(id);
};

Modifier.prototype.removeChild = function(id, cb) {
  console.log('removechild');
  this.focusElement.remove(id);
};

function _focus(transition) {
  var gutter = this.size[0] / 10;
  var x = 0;
  var y = 0;
  var height = this.options ? this.size[1] * this.options.height : this.size[1]/4;
  this.elements.forEach(function(element, i) {
    // if (!element.transitionable.initialize) {
    //   _initialize.call(this, element);
    //   element.transitionable.initialize = true;
    // }
    if (this.focusElement.index === i) {
      this.focusElement._element.style.zIndex = 10;
      this.focusElement.transitionable.size.set([this.size[0] * 0.75, 2 * height], transition);
      this.focusElement.transitionable.transform.setTranslate([this.size[0] / 8, y === 0 ? y + height/2 : y - height, 10], transition);
      this.focusElement.transitionable.transform.setRotate([0, 0, 0], transition);
      x += this.size[0] / 4 + gutter;
      if (x >= this.size[0] - gutter) {
        y += height + gutter;
        x = 0;
      }
      return;
    }
    element.transitionable.origin.set([0.5, 0]);
    element.transitionable.size.set([this.size[0] / 4, height], transition);
    element.transitionable.transform.setTranslate([x, y, 0], transition);
    x += this.size[0] / 4 + gutter;
    if (x >= this.size[0] - gutter) {
      y += height + gutter;
      x = 0;
    }
    //element._element.style.backgroundColor = 'hsl(' + color.get() + ', 75%, 50%)';
  }.bind(this));
}

Modifier.prototype.focus = function(id, childs) {
  this.focusElement = this.elements[id];
  this.focusElement.index = id;
  if (childs.length) this.focusElement.set(childs);
  this.focusElement.setModifier(new childModifier({height : 1/2}));
  this.activeState = _focus;
  this.activeState(transition);
};

Modifier.prototype.unFocus = function() {
  _initialState.call(this, transition);
  this.focusElement._element.getElementsByTagName('IMG')[0].style.display = 'initial';
  this.focusElement._element.style.zIndex = 0;
  this.focusElement = undefined;
  this.activeState = _initialState;
};

function _rotation(focus, el, set, cb) {
  el.transitionable.transform.setRotate([0, set ? 0 : Math.PI, 0], rotate);
  focus.transitionable.transform.setRotate([0, set ? Math.PI : 0, 0], rotate, function() {
    if (cb) {
      cb();

    }
  });
  focus._childs.forEach(function(el) {
    el.transitionable.transform.setRotate([0, set ? Math.PI : 0, 0], rotate);
  });
}

function _superfocus() {
  var el = this.elements[this.elements.length - 1];
  el.transitionable.size.set([this.size[0] * 0.75, this.size[1] / 2]);
  el.transitionable.origin.set([0.5, 0]);
  el.transitionable.transform.setTranslate(this.focusElement.transitionable.transform.translate.state);
  el.transitionable.transform.setRotate([0, Math.PI, 0]);
  _rotation(this.focusElement, el, true);
}

Modifier.prototype.superFocus = function() {
  //var el = this.elements[this.elements.length-1];
  this.focusElement._element.querySelector('h1').style.visibility = 'hidden';
  this.focusElement._element.querySelector('span.close-icon').style.visibility = 'hidden';
  this.activeState = _superfocus;
};

Modifier.prototype.unSuperFocus = function(cb) {
  this.focusElement._element.querySelector('h1').style.visibility = 'initial';
  this.focusElement._element.querySelector('span.close-icon').style.visibility = 'initial';
  var el = this.elements[this.elements.length - 1];
  _rotation(this.focusElement, el, false, cb);
  this.activeState = _focus;
};


Modifier.prototype.child = function(child) {
  if (!this.focusElement) return;
  this.focusElement.add(child);
};


function childModifier(options) {
  this.elements = [];
  this.activeState = _initialState;
  if(options) this.options = options;
}

childModifier.prototype.setState = function(context, elements) {
  if (!context) return;
  this.size = context;
  var trans = (this.elements.length !== this.length) ? transition : null;
  this.elements = elements;
  this.length = this.elements.length;
  this.activeState(trans);
};

childModifier.prototype.remove = function(id, cb, view) {
  var element = this.elements[id];
  element.transitionable.opacity.set(0, transition);
  element.transitionable.size.set([0, 0], transition, function() {
    cb();
    view.remove(id);
  });
};

module.exports = Modifier;
