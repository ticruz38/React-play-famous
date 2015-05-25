//'use strict';

//var Transitionable = require('famous/transitions/Transitionable');

//var Transitionable = require('famous/transitions/Transitionable');
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

function _socialSize() {
    var size = [];
    size[0] = this.size[0] / 2;
    size[1] = this.size[1] / 5;
    return size;
}

function _setTranslate(i, socialSize) {
    var translate = [];
    if (i < 4) {
        if (i % 2) {
            translate[0] = this.size[0] / 2;
        } else {
            translate[0] = 0;
        }
        if (i >= 2) {
            translate[1] = socialSize[1] / 4;
        } else {
            translate[1] = 0;
        }
    } else {
        translate[0] = this.size[0]/2;
        translate[1] = (i - 2) * socialSize[1];
    }
    translate[2] = 0;
    return translate;
}

function _initialState(elements) {
    if (!elements.length) return;
    var socialSize = _socialSize.call(this);
    for (var i = 0; i < 4; i++) { // set size for the first 4 elements (socialbutton)
        elements[i].transitionable.size.set([socialSize[0], socialSize[1]]);
    }
}

function _didMount(elements) { // set elements invisible before rendering
    elements.forEach(function(element, i) {
        element.transitionable.size.set([0, 0]);
        element.transitionable.opacity.set(0);
    });
}

function _willUnMount(cb) {
    this.elements.forEach(function(element, i) {
        element.transitionable.size.set([0, 0], transition);
        element.transitionable.opacity.set(0, transition);
    });
    setTimeout(function() {
      cb();
    }, transition.duration);
}

function _setState(elements) {
    var socialSize = _socialSize.call(this);
    elements.forEach(function(element, i) {
        var translate = _setTranslate.call(this, i, socialSize);
        if (i < 4) {
            element.transitionable.size.set([socialSize[0], socialSize[1] / 4]);
            element.transitionable.origin.set([0, 0]);
            element.transitionable.transform.setTranslate(translate);
            // element._element.style.fontSize = Math.sqrt(socialSize[0] * socialSize[1]) / 10 + 'px';
            // element._element.style.paddingTop = Math.sqrt(socialSize[0] * socialSize[1]) / 15 + 'px';
        } else if (i < 8) {
            //if (i % 2) element.transitionable.size.set([socialSize[0], socialSize[1] / 2]);
            element.transitionable.size.set([socialSize[0], i === this.elements.length - 1 ? socialSize[1] / 2 : socialSize[1]]);
            element.transitionable.origin.set([0.5, 0.5]);
            element.transitionable.transform.setTranslate(translate);
            element._element.style.fontSize = Math.sqrt(socialSize[0] * socialSize[1]) / 8;
        }
    }.bind(this));
}

Modifier.DEFAULT_OPTIONS = {};

Modifier.prototype.setState = function(context, elements, trans) {
    if (!context) return;
    this.size = context.size;
    this.elements = elements;
    _setState.call(this, elements);
};

Modifier.prototype.willUnMount = function(cb) {
    console.log('willUnMount');
    _willUnMount.call(this, cb);
};

module.exports = Modifier;
