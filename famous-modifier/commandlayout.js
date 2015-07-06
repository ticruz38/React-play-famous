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
    this.cursor = document.querySelector('rect.cursor');
    this.y = 0;
    this.width = _getWidth()/25;
    //this.x = 0;
}

Modifier.DEFAULT_OPTIONS = {};

function _getWidth () {
  return document.querySelector('div.dashboard').clientHeight;
}

Modifier.prototype.setState = function(context, elements, trans) {
    if (!context) return;
    console.log(elements);
    this.size = context;
    this.elements = elements;
    this.activeState();
};

Modifier.prototype.updateX = function (x) {
  this.y += x*25;
  this.activeState();
};

Modifier.prototype.update = function (x) {
  this.y += x;
  this.activeState();
};

Modifier.prototype.setX = function (x) {
  this.y = x*25;
  this.activeState();
};

Modifier.prototype.set = function (x) {
  this.y = x;
  this.activeState();
};

function _initialState() {
    this.elements.forEach(function(element) {
      var time = element._element.getAttribute('data-time');
      element.transitionable.transform.setTranslate([0, time*25 - this.y, 0]);
    }.bind(this));
    this.cursor.setAttribute('x', this.y / 25);
    this.cursor.setAttribute('width', this.width);
}

module.exports = Modifier;
