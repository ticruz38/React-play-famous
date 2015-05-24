var OptionsManager = require('famous/core/OptionsManager');

var transition = {
    duration: 600,
    curve: 'easeInOut'
};

function Modifier(options) {
    this.options = Object.create(Modifier.DEFAULT_OPTIONS);
    this.optionsManager = new OptionsManager(this.options);
    if (options) this.setOptions(options);
    this.activeState = _setState;
}

Modifier.DEFAULT_OPTIONS = {};

function _socialSize() {
    var size = [];
    size[0] = this.size[0] / 2;
    size[1] = this.size[1] / 5;
    return size;
}

function _setTranslate(i, socialSize) {
    var translate = [];
    translate[0] = this.size[0] / 2;
    translate[1] = (i + 1) * socialSize[1];
    translate[2] = 0;
    return translate;
}

function _setState() {
    var socialSize = _socialSize.call(this);
    this.elements.forEach(function(element, i) {
        var translate = _setTranslate.call(this, i, socialSize);
        element.transitionable.size.set([socialSize[0], i === this.elements.length - 1 ? socialSize[1] / 2 : socialSize[1]]);
        element.transitionable.origin.set([0.5, 0.5]);
        element.transitionable.transform.setRotate([0, Math.PI, 0]);
        element.transitionable.transform.setTranslate(translate);
        element._element.style.fontSize = Math.sqrt(socialSize[1] * socialSize[0]) / 8;
    }.bind(this));
}

Modifier.prototype.setState = function(context, elements, trans) {
    if (!context) return;
    this.size = context.size;
    this.elements = elements;
    _setState.call(this, elements);
};

Modifier.prototype.willUnMount = function(cb) {
    console.log('willUnMount');
    setTimeout(function() {
        cb();
    }, transition.duration);
};

module.exports = Modifier;
