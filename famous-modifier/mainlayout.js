//var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var OptionsManager = require('famous/core/OptionsManager');
var Easing = require('famous/transitions/Easing');

var transition = {
    duration: 600,
    curve: 'easeInOut'
};
var easing = {
    duration: 600,
    curve: Easing.outBack
};

function Modifier(options) {
    this.options = Object.create(Modifier.DEFAULT_OPTIONS);
    this.optionsManager = new OptionsManager(this.options);
    if (options) this.setOptions(options);
    this.initialized = false;
    this.activeState = _initialState;
}

Modifier.DEFAULT_OPTIONS = {};

function _setAuthSize() {
    var size = [];
    size[0] = this.size[0] / 5;
    size[1] = size[0] / 3;
    var fontSize = Math.sqrt(this.size[0] + this.size[1]);
    return [size[0], size[1], fontSize];
}

function _setTitleSize() {
    var size = [];
    size[0] = this.size[0] / 2;
    size[1] = size[0] / 4;
    var fontSize = size[1];
    return [size[0], size[1], fontSize];
}

function _setSearchSize() {
    var size = [];
    size[0] = this.size[0] / 3;
    size[1] = size[0] / 5;
    var fontSize = Math.cbrt(this.size[0] * this.size[1] * 0.15);
    return [size[0], size[1], fontSize];
}

function _searchState(trans) {
    var AuthSize = _setAuthSize.call(this);
    if (!this.initialized) _initialState.call(this);
    this.Auth.transitionable.transform.setTranslate([this.size[0] - AuthSize[0] / 2, AuthSize[1] / 2, 100], trans);
    this.Auth.transitionable.size.set([AuthSize[0], AuthSize[1]], trans);
    this.Auth.transitionable.origin.set([0.5, 0.5], trans);

    this.body._element.fontSize = AuthSize[2];

    //this.title._element.style.fontSize = titleSize[2] + 'px';
}

function _bigState(trans) {
    if (!this.initialized) _initialState.call(this);
    var size = this.body.transitionable.size.get();
    this.body.transitionable.size.set([this.size[0], size[1]], trans);
}

function _AuthState(trans) {
    if (!this.initialized) _initialState.call(this);
    this.Auth.transitionable.transform.setTranslate([this.size[0] / 2, this.size[1] / 2, 100], trans);
    this.Auth.transitionable.size.set([this.size[0] / 2, this.size[1] / 2], trans);
}

function _initialState(trans) {
    var searchSize = _setSearchSize.call(this);
    var AuthSize = _setAuthSize.call(this);

    this.title.transitionable.transform.setTranslate([this.size[0] / 2, AuthSize[1] / 2, 0], trans);
    this.title.transitionable.origin.set([0.5, 0.5], trans);
    this.title.transitionable.size.set([AuthSize[0], AuthSize[1]], trans);
    this.title.transitionable.fontSize = new Transitionable(AuthSize[2], trans);
    //this.title._element.style.fontSize = titleSize[2] + 'px';

    this.button.transitionable.size.set([AuthSize[0], AuthSize[1]]);

    this.body.transitionable.transform.setTranslate([this.size[0] / 2, this.size[1]/2, 0], trans);
    this.body.transitionable.origin.set([0.5, 0.5], trans);
    this.body.transitionable.size.set([this.size[0] * 0.75, this.size[1] - 2 * AuthSize[1]], trans);
    //this.body.transitionable.opacity.set(0.5, trans);
    this.body._element.style.fontSize = searchSize[2] + 'px';

    this.Auth.transitionable.transform.setTranslate([this.size[0] - AuthSize[0] / 2, AuthSize[1] / 2, 100], trans);
    this.Auth.transitionable.size.set([AuthSize[0], AuthSize[1]], trans);
    this.Auth.transitionable.origin.set([0.5, 0.5], trans);
    this.Auth._element.style.fontSize = AuthSize[2] + 'px';
    var padding = AuthSize[2] / 4;
    this.Auth._element.style.paddingTop = padding + 'px';
    this.initialized = true;
}

Modifier.prototype.initialState = function() {
    this.activeState = _initialState;
    if (this.size) this.activeState(easing); //we check if modifier allready got the context object
};

Modifier.prototype.AuthState = function() {
    this.activeState = _AuthState;
    if (this.size) this.activeState(easing); //we check if modifier allready got the context object
};

Modifier.prototype.searchState = function() {
    this.activeState = _searchState;
    if (this.size) this.activeState(easing); //we check if modifier allready got the context object
};

Modifier.prototype.bigState = function() {
    this.activeState = _bigState;
    if (this.size) this.activeState(easing);
};

Modifier.prototype.setState = function(context, elements, trans) {
    if (!context) return;
    this.size = context.size;
    this.opacity = context.opacity;
    if (elements.length) {
        this.title = elements[0];
        this.Auth = elements[1];
        this.body = elements[2];
        this.button = elements[3];
        this.activeState();
    }
};

module.exports = Modifier;
