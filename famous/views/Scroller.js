define(function (require, exports, module) {
    var Entity = require('../core/Entity');
    var Group = require('../core/Group');
    var OptionsManager = require('../core/OptionsManager');
    var Transform = require('../core/Transform');
    var Utility = require('../utilities/Utility');
    var ViewSequence = require('../core/ViewSequence');
    var EventHandler = require('../core/EventHandler');

    /**
     * Scroller lays out a collection of renderables, and will browse through them based on
     * accessed position. Scroller also broadcasts an 'edgeHit' event, with a position property of the location of the edge,
     * when you've hit the 'edges' of it's renderable collection.
     * @class Scroller
     * @constructor
     * @event error
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scroller instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Number} [clipSize=undefined] The size of the area (in pixels) that Scroller will display content in.
     * @param {Number} [margin=undefined] The size of the area (in pixels) that Scroller will process renderables' associated calculations in.
     */
    function Scroller(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this._optionsManager.setOptions(options);

        this._node = null;
        this._originalNode = null;
        this._position = 0;

        // used for shifting nodes
        this._positionOffset = 0;

        this._positionGetter = null;
        this._outputFunction = null;
        this._masterOutputFunction = null;
        this.outputFrom();

        this._onEdge = 0; // -1 for top, 1 for bottom

        this.group = new Group();
        this.group.add({
            render: _innerRender.bind(this)
        });

        this._entityId = Entity.register(this);
        this._size = [undefined, undefined];
        this._contextSize = [undefined, undefined];

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Scroller.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        margin: 0,
        clipSize: undefined,
        groupScroll: false
    };

    var EDGE_TOLERANCE = 0; //slop for detecting passing the edge

    function _sizeForDir(size, angle) {
        if (angle > Math.PI * 2) {
            console.log("hey");
            angle === Math.PI * 2;
        }
        //console.log(angle);
        if (!size) size = this._contextSize;
        var dimension = this.options.direction;
        return (size[dimension] === undefined) ? this._contextSize[dimension] * Math.cos(angle) : size[dimension] * Math.cos(angle);
    }

    /*function _sizeForDir(size, angle) {
        if (!size) size = this._contextSize;
        var dimension = this.options.direction;
        return (size[dimension] === undefined) ? this._contextSize[dimension] : size[dimension] * Math.cos(angle);
    }*/

    function _output(node, offset, target, angle) {
        var size = node.getSize ? node.getSize() : this._contextSize;
        var transform = this._outputFunction(offset, angle);
        target.push({
            transform: transform,
            target: node.render()
        });
        return _sizeForDir.call(this, size, angle);
    }

    function _getClipSize(angle) {
        if (this.options.clipSize !== undefined) return this.options.clipSize;
        if (this._contextSize[this.options.direction] > this.getCumulativeSize()[this.options.direction]) {
            return _sizeForDir.call(this, this.getCumulativeSize(), angle);
        } else {
            return _sizeForDir.call(this, this._contextSize, angle);
        }
    }

    /**
     * Returns the cumulative size of the renderables in the view sequence
     * @method getCumulativeSize
     * @return {array} a two value array of the view sequence's cumulative size up to the index.
     */
    Scroller.prototype.getCumulativeSize = function (index) {
        if (index === undefined) index = this._node._.cumulativeSizes.length - 1;
        return this._node._.getSize(index);
    };

    /**
     * Patches the Scroller instance's options with the passed-in ones.
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scroller instance.
     */
    Scroller.prototype.setOptions = function setOptions(options) {
        if (options.groupScroll !== this.options.groupScroll) {
            if (options.groupScroll)
                this.group.pipe(this._eventOutput);
            else
                this.group.unpipe(this._eventOutput);
        }
        this._optionsManager.setOptions(options);
    };

    /**
     * Tells you if the Scroller instance is on an edge.
     * @method onEdge
     * @return {Boolean} Whether the Scroller instance is on an edge or not.
     */
    Scroller.prototype.onEdge = function onEdge() {
        return this._onEdge;
    };

    /**
     * Allows you to overwrite the way Scroller lays out it's renderables. Scroller will
     * pass an offset into the function. By default the Scroller instance just translates each node
     * in it's direction by the passed-in offset.
     * Scroller will translate each renderable down
     * @method outputFrom
     * @param {Function} fn A function that takes an offset and returns a transform.
     * @param {Function} [masterFn]
     */
    /*Scroller.prototype.outputFrom = function outputFrom(fn, masterFn) {
        if (!fn) {
            fn = function (offset) {
                return (this.options.direction === Utility.Direction.X) ? Transform.translate(offset, 0) : Transform.translate(0, offset);
            }.bind(this);
            if (!masterFn) masterFn = fn;
        }
        this._outputFunction = fn;
        this._masterOutputFunction = masterFn ? masterFn : function (offset) {
            return Transform.inverse(fn(-offset));
        };
    };*/

    Scroller.prototype.outputFrom = function outputFrom(deplacement, masterFn) {
        //console.log(deplacement);
        var fn = function (offset, angle) {
            if (this.options.direction === Utility.Direction.X) {
                return Transform.multiply(Transform.translate(offset, 0), Transform.rotateY(angle));
            } else {
                return Transform.multiply(Transform.translate(0, offset), Transform.rotateX(angle));
            }
        }.bind(this);
        if (!masterFn) {
            masterFn = function (offset, angle) {
                if (this.options.direction === Utility.Direction.X) {
                    return Transform.translate(offset, 0);
                } else {
                    return Transform.translate(0, offset);
                }
            }.bind(this);
        }
        this._outputFunction = fn;
        this._masterOutputFunction = masterFn;
        return ('hey');
    };


    /**
     * The Scroller instance's method for reading from an external position. Scroller uses
     * the external position to actually scroll through it's renderables.
     * @method positionFrom
     * @param {Getter} position Can be either a function that returns a position,
     * or an object with a get method that returns a position.
     */
    Scroller.prototype.positionFrom = function positionFrom(position) {
        if (position instanceof Function) this._positionGetter = position;
        else if (position && position.get) this._positionGetter = position.get.bind(position);
        else {
            this._positionGetter = null;
            this._position = position;
        } if (this._positionGetter) this._position = this._positionGetter.call(this);
    };

    /**
     * Sets the collection of renderables under the Scroller instance's control.
     *
     * @method sequenceFrom
     * @param node {Array|ViewSequence} Either an array of renderables or a Famous viewSequence.
     * @chainable
     */
    Scroller.prototype.sequenceFrom = function sequenceFrom(originalNode) {
        var node;
        if (originalNode instanceof Array) node = new ViewSequence({
            array: originalNode
        });
        this._node = originalNode;
        this._originalNode = originalNode;
        this._positionOffset = 0;
        return this._node;
    };

    /**
     * Returns the width and the height of the Scroller instance.
     *
     * @method getSize
     * @return {Array} A two value array of the Scroller instance's current width and height (in that order).
     */
    Scroller.prototype.getSize = function getSize(actual) {
        return actual ? this._contextSize : this._size;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scroller.prototype.render = function render() {
        if (!this._node) return null;
        if (this._positionGetter) this._position = this._positionGetter.call(this);
        return this._entityId;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    Scroller.prototype.commit = function commit(context) {
        //console.log(this._contextSize, this.getCumulativeSize())
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        // reset edge detection on size change
        if (!this.options.clipSize && (size[0] !== this._contextSize[0] || size[1] !== this._contextSize[1])) {
            this._onEdge = 0;
            this._contextSize[0] = size[0];
            this._contextSize[1] = size[1];

            if (this.options.direction === Utility.Direction.X) {
                this._size[0] = _getClipSize.call(this);
                this._size[1] = undefined;
            } else {
                this._size[0] = undefined;
                this._size[1] = _getClipSize.call(this);
            }
        }

        var scrollTransform = this._masterOutputFunction(-this._position);

        return {
            transform: Transform.multiply(transform, scrollTransform),
            size: size,
            opacity: opacity,
            origin: origin,
            target: this.group.render()
        };
    };

    function _setAngle(offset, position) {
        var middle = window.innerWidth / 2;
        var angle = (Math.PI / 2.1) * (0 + (Math.abs(middle - Math.abs(offset - position))) / (middle));

        console.log(angle);
        return angle;
    }

    function _pushNode() {

    }
    Scroller.prototype.sizeForDir = function () {

    }

    function _innerRender() {
        var size = null;
        var result = [];
        var offset = -this._positionOffset;
        var currNode = this._node;
        var position = this._position;
        var angle = _setAngle.call(this, offset, position);
        var clipSize = _getClipSize.call(this, angle);
        //console.log(clipSize, this.options.margin);
        while (currNode && offset - position < clipSize + 8000) {
            //console.log(this._node._.firstNode);
            //console.log(offset)
            angle = _setAngle.call(this, offset, position);
            offset += _output.call(this, currNode, offset, result, angle);
            currNode = currNode.getNext ? currNode.getNext() : null;
        }



        var sizeNode = this._node;
        var nodesSize = _sizeForDir.call(this, sizeNode.getSize(), angle);
        if (offset < clipSize) {
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getPrevious();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize(), angle);
            }
            sizeNode = this._node;
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getNext();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize(), angle);
            }
        }

        if (!currNode) {
            currNode = this._node;
        } else if (!this._node.getPrevious() && position < -EDGE_TOLERANCE) {
            if (this._onEdge !== -1) {
                this._onEdge = -1;
                this._eventOutput.emit('onEdge', {
                    position: 0
                });
            }
        } else {
            if (this._onEdge !== 0) {
                this._onEdge = 0;
                this._eventOutput.emit('offEdge');
            }
        }

        // backwards
        currNode = (this._node && this._node.getPrevious) ? this._node.getPrevious() : null;
        offset = -this._positionOffset;
        if (currNode) {
            size = currNode.getSize ? currNode.getSize() : this._contextSize;
            offset -= _sizeForDir.call(this, size, angle);
        }

        while (currNode && ((offset - position) > -(clipSize + this.options.margin))) {
            _output.call(this, currNode, offset, result, angle);
            currNode = currNode.getPrevious ? currNode.getPrevious() : null;
            if (currNode) {
                angle = _setAngle.call(this, offset, currNode, position);
                size = currNode.getSize ? currNode.getSize() : this._contextSize;
                offset -= _sizeForDir.call(this, size, angle);
            }
        }


        return result;
    }

    module.exports = Scroller;
});
