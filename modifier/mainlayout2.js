define('MainLayout2', function (require, exports, module) {
    var Transform = require('famous/core/Transform');

    var transition = {
        duration: 2000,
        curve: 'easeInOut'
    };

    function Modifier(options) {
        this.initialize = false;
    }

    function originTranslate(size, origin) {
        if (!size) return [0, 0];
        return [size[0] * origin[0], size[1] * origin[1]];
    }

    function _headerState(context) {
        this.transitionable.transform.setTranslate([0, context.size[1] * (1 / 8), 0]);
        this.transitionable.size.set([context.size[0], context.size[1] * (1 / 8)]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([0, 0]);
    }

    function _contentState(context) {
        this.transitionable.transform.setTranslate([0, context.size[1] * (1 / 8), 0]);
        this.transitionable.size.set([context.size[0], context.size[1] * (6 / 8)]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([0, 0]);
    }

    function _footerState(context) {
        this.transitionable.transform.setTranslate([0, context.size[1] * (7 / 8), 0]);
        this.transitionable.size.set([context.size[0], context.size[1] * (1 / 8)]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([0, 0]);
    }

    function _modalState(context) {
        this.transitionable.transform.set(context.transform)
        this.transitionable.size.set(context.size);
        this.transitionable.opacity.set(context.opacity);
        this.transitionable.origin.set(context.origin);
    }

    function _removeState(context, cb) {
        this.transitionable.transform.setTranslate([0, context.size[1] * (1 / 8), -context.size[1]], transition)
        this.transitionable.size.set([0, 0], transition, cb);
        this.transitionable.opacity.set(.5);
    }

    function _bindEvents(elements, context) {
        elements.forEach(function (el, i) {
            el.onRemove = function (cb) {
                _removeState.call(el, context, cb);
            }
        });
    }
    Modifier.prototype.setState = function (context, elements, trans) {
        if (!context) return;
        var header = elements[0];
        var content = elements[1];
        var footer = elements[2];
        var modal = elements[3];
        _headerState.call(header, context);
        _contentState.call(content, context);
        _footerState.call(footer, context);
        if (modal) _modalState.call(modal, context);
        //_bindEvents.call(this, elements, context);
    }
    module.exports = Modifier;
})
