define('modalLayout', function (require, exports, module) {

    var OptionsManager = require('famous/core/OptionsManager');
    var Transform = require('famous/core/Transform');

    function Modifier(options) {
        this.options = Object.create(Modifier.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options)
    }

    Modifier.DEFAULT_OPTIONS = {

    }

    var transition = {
        duration: 600,
        curve: 'easeInOut'
    };

    function _originalTransform(origin, size) {
            return [size[0] * origin[0], size[1] * origin[1], 0];
        }
        //
        //    function _createEntities(element) {
        //
        //    }

    //    function _removeElement() {
    //
    //    }

    function _setInitialState(context, element) {
        console.log('initialState');
        element.transitionable.origin.set([.5, .5]);
        element.transitionable.opacity.set(0);
        element.transitionable.size.set([0, 0]);
        element.transitionable.transform.setTranslate(_originalTransform([.5, .5], context.size));
        element.transitionable.initialize = true;
        _setState(context, element, transition);
    }

    function _setState(context, element, trans) {
        console.log('state', element.options.data);
        var size = [context.size[0] / 3, context.size[1] / 3];
        element.transitionable.origin.set([.5, .5], trans);
        element.transitionable.opacity.set(1, trans);
        element.transitionable.size.set(size, trans);
        element.transitionable.transform.setTranslate([context.size[0] / 2, context.size[1] / 2, 0], trans);
    }

    Modifier.prototype.setState = function (context, element, trans) {
        console.log('modalLayout');
        var element = element[0];
        if (context && element) {
            if (this.id == element.id) {
                _setState(context, element, null)
            } else {
                this.id = element.id;
                element.transitionable.initialize ?
                    _setState(context, element, trans) :
                    _setInitialState(context, element);
            }
        }
    }
    module.exports = Modifier;
});
