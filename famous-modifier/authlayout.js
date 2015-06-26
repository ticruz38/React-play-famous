var Easing = require('famous/transitions/Easing');
var OptionsManager = require('famous/core/OptionsManager');

var easing = {
    duration: 600,
    curve: Easing.outBack
};

function Modifier(options) {
    this.options = Object.create(Modifier.DEFAULT_OPTIONS);
    this.optionsManager = new OptionsManager(this.options);
    if (options) this.setOptions(options);
    this.activeState = _initialState;
}

Modifier.DEFAULT_OPTIONS = {};

Modifier.prototype.setState = function(context, elements, trans) {
    if (!context || !elements.length) return;
    console.log(elements);
    this.size = context;
    this.signup = elements[0];
    this.login = elements[1];
    this.activeState();
};

Modifier.prototype.switchState = function () {
    this.on ? this.activeState = _startState : this.activeState = _endState;
    this.activeState(true);
    this.on = !this.on;
};

function _initialState(trans) {
    this.login.transitionable.transform.setRotate([0, Math.PI, 0]);
    this.login.transitionable.origin.set([0.5, 0.5]);
    //this.login.transitionable.transform.setTranslate([this.size[0]/2, this.size[1]/2]);
    this.signup.transitionable.transform.setRotate([0, 0, 0]);
    this.signup.transitionable.origin.set([0.5, 0.5]);
    //this.signup.transitionable.transform.setTranslate([this.size[0]/2, this.size[1]/2]);
}

function _startState(trans) {
  this.login.transitionable.transform.setRotate([0, Math.PI, 0], trans ? easing : null);
  this.signup.transitionable.transform.setRotate([0, 0, 0], trans ? easing : null);
}

function _endState(trans) {
    this.signup.transitionable.transform.setRotate([0, Math.PI, 0], trans ? easing : null);
    this.login.transitionable.transform.setRotate([0, 0, 0], trans ? easing : null);
}

module.exports = Modifier;
