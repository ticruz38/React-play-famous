define('scrollLayout', function (require, exports, module) {

    var Transform = require('famous/core/Transform'); // not needed yet
    var OptionsManager = require('famous/core/OptionsManager');
    var ScrollSync = require("famous/inputs/ScrollSync");

    var transition = {
        duration: 2000,
        curve: 'easeInOut'
    };

    function Modifier(options) {
        this.options = Object.create(Modifier.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);
        this.sync = new ScrollSync({
            direction: 0
        });
        this.originTranslate = [];
        this.position = 0;
        this.elSize = [];
        _initialize.call(this);
        this.initialized = false;
    }

    Modifier.DEFAULT_OPTIONS = {
        scroller: undefined,
        origin: [.5, .5]
    }

    function _trigo(i) {
        var angle = this.position * 2 * Math.PI / this.size;
        return [Math.cos(angle + 2 * i * Math.PI / this.length), Math.sin(angle + 2 * i * Math.PI / this.length)]
    }

    function _originTranslate(el) {
        var origin = this.options.origin;
        var originTranslate = [this.elSize[0] * origin[0], this.elSize[1] * origin[1], 0];
        this.originTranslate = originTranslate;
    }

    function _setTransform(trigo) {
        return [this.size / 2 + this.size * trigo[0] / 3, this.originTranslate[1], this.size * trigo[1] / 3];
    }

    function _setSize(trigo) {
        return [this.elSize[0] * (2 + trigo[1]) / 2, this.elSize[1] * (2 + trigo[1]) / 2];
    }

    function _updateState(payload) {
        this.position += payload.delta;

        this.elements.forEach(function (el, i) {
            var trigo = _trigo.call(this, i);
            var transform = _setTransform.call(this, trigo);
            var size = _setSize.call(this, trigo);
            el.transitionable.transform.setTranslate(transform);
            el.transitionable.size.set(size);
        }.bind(this));
    }

    function _initialize() {
        if (!this.options.scroller) console.log('you need to define a scroller!');
        this.options.scroller.pipe(this.sync);
        this.sync.on('update', function (payload) {
            _updateState.call(this, payload);
        }.bind(this));
    }

    function _startPosition(el) {
        el.transitionable.origin.set([.5, .5]);
        el.transitionable.size.set([this.size, this.size]);
        el.transitionable.transform.setTranslate([0, 0, 0]);
    }

    Modifier.prototype.setOptions = function setOptions(options) {
        this.optionsManager.patch(options);
    };

    function _setInitialState(elements, transition) {
        this.length = elements.length;
        elements.forEach(function (el, i) {
            el.pipe(this.sync);
            //set very first to handle correct transform
            this.elSize = [this.size / this.length, this.size / this.length];
            _originTranslate.call(this, el);
            var trigo = _trigo.call(this, i);
            var transform = _setTransform.call(this, trigo);
            var size = _setSize.call(this, trigo);
            if (!el.transitionable.initialize) _startPosition.call(this, el);
            el.transitionable.origin.set(this.options.origin, transition);
            el.transitionable.transform.setTranslate(transform, transition);
            el.transitionable.size.set(size, transition);
        }.bind(this));
        this.elements = elements;
    }

    Modifier.prototype.setState = function (context, elements, trans) {
        if (!context) return;
        if (this.size === undefined || this.size === context.size[0]) {
            this.size = context.size[0];
            _setInitialState.call(this, elements, transition);
        } else {
            this.size = context.size[0];
            _setInitialState.call(this, elements, null);
        }
    }
    module.exports = Modifier;
});
