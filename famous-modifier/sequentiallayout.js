define('SequentialLayout', function (require, exports, module) {

    var Transform = require('famous/core/Transform'); // not needed yet

    var transition = {
        duration: 600,
        curve: 'easeInOut'
    };

    function Modifier() {
        //this.elements = [];
    }

    function _initialState() {
        this.transitionable.transform.setTranslate([0, 0, 0]);
        this.transitionable.size.set([0, 0]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([.5, .5]);
    }

    Modifier.prototype.setState = function (context, elements, trans) {
        if (!context) return;
        var latitude = context.size[0],
            length = elements.length,
            childSize = [latitude / length, context.size[1]],
            originTranslate = function (element, direction) {
                return element.transitionable.origin.get()[direction] * childSize[direction];
            };

        elements.forEach(function (element, index) {
            if (!element.transitionable.initialize) {
                _initialState.call(element);
            }
            element.transitionable.transform.setTranslate([(index * childSize[0]) + originTranslate(element, 0), originTranslate(element, 1), 0], transition);
            element.transitionable.size.set([childSize[0], context.size[1]], transition);
            element.transitionable.initialize = true;
        }, this);
    }
    module.exports = Modifier;
});
