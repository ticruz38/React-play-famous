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
    if (!context) return;
    console.log('commandState');
    this.size = context;
    this.elements = elements;
    this.activeState();
};

function _initialState(trans) {
    this.elements.forEach(function(element) {
      var time = element._element.getAttribute('data-time');
      element.transitionable.transform.setTranslate([0, time*25, 0]);
    });
}

module.exports = Modifier;
