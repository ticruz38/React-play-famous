define('scrollModalLayout', function (require, exports, module) {

    var OptionsManager = require('famous/core/OptionsManager');
    var Transform = require('famous/core/Transform');
    var ScrollSync = require("famous/inputs/ScrollSync");
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Drag = require('famous/physics/forces/Drag');

    function Modifier(options) {
        this.options = Object.create(Modifier.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        this._physicsEngine = new PhysicsEngine();
        this._particle = new Particle();
        this._physicsEngine.addBody(this._particle);
        this.drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: this.options.drag
        });
        this.friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: this.options.friction
        });
        if (options) {
            this.setOptions(options);
            if (options.active) this.active = options.active;
        }
        this.commit = true;
        this.deplacement = 0;
        this.sync = new ScrollSync({
            direction: 0
        });
        _initialize.call(this);
    }

    function _initialize() {
        if (!this.options.scroller) console.log('you need to define a scroller!');
        this._physicsEngine.attach([this.drag, this.friction], this._particle); //attach particle with drag and friction forces
        this.options.scroller.pipe(this.sync);
        this.sync.on('update', function (payload) {
            _updateState.call(this, payload);
        }.bind(this));
        this.sync.on('end', function (payload) {
            this.deplacement = _findPosition.call(this);
            this.setPosition(this.deplacement);
            //_setInitialState.call(this, this.elements, this.options.transition);
        }.bind(this));
    }

    Modifier.DEFAULT_OPTIONS = {
        friction: 0.005,
        drag: 0.0001,
        modalSize: [1 / 3, 1 / 3],
        origin: [.5, .5],
        transition: {
            duration: 200,
            curve: 'easeInOut'
        },
        active: null
    };

    function _trigo(i, angle) {
        if (Math.abs(this.position) > this.size) this.position -= Math.sign(this.position) * this.size;
        angle ? this.angle = angle : this.angle = this.position * 2 * Math.PI / this.size;
        return [Math.cos(this.angle + i * Math.PI / this.length), Math.sin(this.angle + i * Math.PI / this.length)]
    }


    function _setSize(trigo) {
        //console.log(Math.abs(trigo[1]) * this.elSize[0], Math.abs(trigo[1]) * this.elSize[1])
        return [Math.pow(Math.abs(trigo[1]), this.length) * this.elSize[0], Math.pow(Math.abs(trigo[1]), this.length) * this.elSize[1]]
    }

    function _setTransform(trigo) {
        var y = trigo[1];
        var c = Math.sign(y);
        var x = this.size / 2 + c * this.size * trigo[0] / 3;
        return [x, this.elSize[1], 1];
    }

    function _updateState(payload) {
        this.deplacement += payload.delta / 5;
        this.setPosition(this.deplacement);
    }

    //    function _updateState(payload) {
    //        if (payload) this.deplacement += payload.delta / 5;
    //        this.position = this.setPosition
    //        this.elements.forEach(function (el, i) {
    //            var trigo = _trigo.call(this, i);
    //            var transform = _setTransform.call(this, trigo);
    //            var size = _setSize.call(this, trigo);
    //            el.transitionable.transform.setTranslate(transform);
    //            el.transitionable.size.set(size);
    //        }.bind(this));
    //    }

    function _bindEvents(elements) {
        elements.forEach(function (el, i) {
            el.on('click', function () {
                this.setPosition(this.length - 2 * i) * this.size / (4 * this.length);
                //                var angle = (this.length - 2 * i) * Math.PI / (2 * this.length);
                //_setInitialState.call(this, elements, this.options.transition);
            }.bind(this));
        }.bind(this));
    }

    function _startState(el) {
            el.transitionable.origin.set([.5, .5]);
            el.transitionable.size.set([0, 0]);
            el.transitionable.transform.setTranslate([this.size / 2, this.elSize[1] / 2, 0]);
            el.transitionable.initialize = true;
        }
        /* a function to register the main position for each elements
         * no arguments
         */
    function _setPosition() {
        this.arrayPositions = [];
        this.arrayPositions.int = [];
        for (var i = 0; i < this.length; i++) {
            var position = (this.length - 2 * i) * this.size / (4 * this.length);
            this.arrayPositions.int[i] = position;
            var angle = (this.length - 2 * i) * Math.PI / (2 * this.length);
            this.arrayPositions[position] = i;
        }
        var int = this.arrayPositions.int[0] - this.arrayPositions.int[1];

        function Populizing(extremity, i) {
            if (extremity === 0) extremity = 0.1;
            var sign = Math.sign(extremity);
            console.log(sign, int);
            var inc;
            i == 0 ? inc = -1 : inc = 1;
            while (Math.abs(extremity) < this.size) {
                extremity += sign * int;
                i += inc;
                if (i == this.length && inc == 1) i = 0;
                if (i == -1 && inc == -1) i = this.length - 1;
                this.arrayPositions[extremity] = i;
            }
        }
        Populizing.call(this, this.arrayPositions.int[this.arrayPositions.int.length - 1], this.arrayPositions.int.length - 1);
        Populizing.call(this, this.arrayPositions.int[0], 0);
    }

    function _findPosition() {
        var diffs = [];
        var keys = [];
        for (var key in this.arrayPositions) {
            if (key == 'int') continue;
            if (this.deplacement == 0) {
                var diff = Math.abs(key);
            } else {
                var diff = Math.abs(this.deplacement - key);
            }
            keys.push(key);
            diffs.push(diff);
        }
        var diff = Math.min.apply(null, diffs);
        var index = diffs.indexOf(diff);
        this.active = this.elements[this.arrayPositions[keys[index]]];
        return parseFloat(keys[index]);
    }

    function _setInitialState(elements, transition) {
        this.elements = elements;
        this.elements.forEach(function (el, i) {
            el.pipe(this.sync);
            var trigo = _trigo.call(this, i);
            var transform = _setTransform.call(this, trigo);
            var elSize = _setSize.call(this, trigo);
            if (!el.transitionable.initialize) _startState.call(this, el);
            el.transitionable.origin.set(this.options.origin, transition);
            el.transitionable.transform.setTranslate(transform, transition);
            el.transitionable.size.set(elSize, transition);
        }.bind(this));
    }


    Modifier.prototype.setOptions = function (options) {
        return this.optionsManager.setOptions(options);
    }

    Modifier.prototype.setPosition = function (x) {
        this._particle.setPosition1D(x);
    }

    Modifier.prototype.getPosition = function () {
        return this._particle.getPosition1D();
    }

    Modifier.prototype.setActive = function (el) {
        var index = this.elements.indexOf(el);
        this.deplacement = (this.length - 2 * index) * this.size / (4 * this.length);
        _setInitialState.call(this, this.elements, this.options.transition);
    }

    Modifier.prototype.setState = function (context, elements, trans) {
        if (!context) return;
        this.elements = elements;
        _bindEvents.call(this, elements);
        this.length = elements.length;
        this.elSize = [context.size[1] * this.options.modalSize[0], context.size[1] * this.options.modalSize[1]]
        var transition = this.options.transition;
        if (this.size === undefined || this.size === context.size[0]) {
            this.size = context.size[0];
            if (this.active) {
                this.setActive(this.active);
                _setPosition.call(this);
                return;
            }
            _setInitialState.call(this, elements, transition);
            _setPosition.call(this);
        } else {
            this.size = context.size[0];
            _setInitialState.call(this, elements, null);
        }
    }

    Modifier.prototype.commitState = function () { // this function should be called inside view commit function
        this.position = this.getPosition();
        this.elements.forEach(function (el, i) {
            var trigo = _trigo.call(this, i);
            var transform = _setTransform.call(this, trigo);
            var elSize = _setSize.call(this, trigo);
            el.transitionable.transform.setTranslate(transform);
            el.transitionable.size.set(elSize);
        }.bind(this));
        return true
    }
    module.exports = Modifier;
});
