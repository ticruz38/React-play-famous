define(function (require, exports, module) {
    var RenderNode = require('../core/RenderNode');
    var Transform = require('../core/Transform');
    var ViewSequence = require('../core/ViewSequence');
    var EventHandler = require('../core/EventHandler');
    var Modifier = require('../core/Modifier');
    var OptionsManager = require('../core/OptionsManager');
    var Transitionable = require('../transitions/Transitionable');
    var TransitionableTransform = require('../transitions/TransitionableTransform');

    function Carousel(options) {
        this.options = Object.create(Carousel.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);
        this.length = 0;
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Carousel.DEFAULT_OPTIONS = {

    }

    function _reflow() {

    }
    /**
     * Patches the Carousel instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Carousel instance.
     */
    Carousel.prototype.setOptions = function setOptions(options) {
        return this.optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the Carousel instance's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous viewSequence.
     */
    Carousel.prototype.sequenceFrom = function sequenceFrom(sequence) {
        this.length = sequence.length;
        if (sequence instanceof Array) sequence = new ViewSequence(sequence);
        this.sequence = sequence;
    };

    Carousel.prototype.commit = function commit(context) {
        var sequence = this.sequence;
        var result = [];
        var currIndex = 0;
    }
    module.exports = Carousel;
})
