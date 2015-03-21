var Transform = require('famous/core/Transform'); // not needed yet
var OptionsManager = require('famous/core/OptionsManager');

var transition = {
    duration: 600,
    curve: 'easeInOut'
};

function Modifier(options) {
    this.options = Object.create(Modifier.DEFAULT_OPTIONS);
    this.optionsManager = new OptionsManager(this.options);
    if (options) this.setOptions(options);
}

Modifier.DEFAULT_OPTIONS = {
    guttersize: [1 / 4, 1 / 4],
    dimensions: [4, 2]
}

function _initialState(prevelement) {
    if (!prevelement) {
        this.transform.setTranslate([0, 0, 0]);
        this.size.set([0, 0]);
        this.origin.set([.5, .5]);
    } else {
        var prevTransitionable = prevelement.transitionable;
        this.transform.setTranslate(prevTransitionable.transform.get());
        this.size.set([0, 0]);
        this.origin.set([.5, .5]);
        this.initialize = true;
    }
}

function _removeState(el, context) {
    el.onRemove = function (cb) {
        console.log('removeState');
        var transform = el.transitionable.transform.get();
        el.transitionable.transform.setTranslate([transform[12], transform[13], -context.size[0]], transition);
        el.transitionable.size.set([0, 0], transition);
        el.transitionable.opacity.set(0, transition, function () {
            cb(el);
        });
    }
};

Modifier.prototype.setOptions = function setOptions(options) {
    this._optionsManager.patch(options);
};

Modifier.prototype.setState = function (context, elements, trans) {
    console.log(context, elements);
    trans ? trans = transition : trans = null;
    if (!context) return;
    var dim = this.options.dimensions,
        gut = this.options.guttersize,
        vignetteSize = [];
    context.size.forEach(function (size, i) {
        var s = size / (dim[i] + ((dim[i] - 1) * gut[i]))
        vignetteSize.push(s);
    });
    var gutterSize = [vignetteSize[0] * gut[0], vignetteSize[1] * gut[1]];
    var x = 0,
        y = 0;
    elements.forEach(function (element, i) {
        _removeState.call(this, element, context);
        var transitionable = element.transitionable;
        if (!element.transitionable.initialize) _initialState.call(transitionable, elements[i]);
        if (i === dim[0]) { //works only if you just jump one line!
            x = 0;
            y++;
        };
        if (y <= dim[1]) {
            transitionable.transform.setTranslate([x * (vignetteSize[0] + gutterSize[0]), y * (vignetteSize[1] + gutterSize[1]), 0], trans);
            transitionable.size.set([vignetteSize[0], vignetteSize[1]], trans);
            transitionable.origin.set([0, 0], trans);
        }
        x++;
    }.bind(this));
}
module.exports = Modifier;
