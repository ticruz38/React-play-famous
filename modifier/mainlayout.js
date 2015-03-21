define('MainLayout', function (require, exports, module) {
    var Transform = require('famous/core/Transform');

    function Modifier(options) {
        this.initialize = false;
    }

    function originTranslate(size, origin) {
        return size * origin;
    }

    function _headerState(context) {
        this.transitionable.transform.setTranslate([originTranslate(context.size[0], 0.5), originTranslate(context.size[1] * (1 / 8), 0.5), 0]);
        this.transitionable.size.set([context.size[0], context.size[1] * (1 / 8)]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([.5, .5]);
    }

    function _contentState(context) {
        this.transitionable.transform.setTranslate([originTranslate(context.size[0], 0.5), context.size[1] * (1 / 8) + context.size[1] * (6 / 8) * 0.5, 0]);
        this.transitionable.size.set([context.size[0], context.size[1] * (6 / 8)]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([.5, .5]);
    }

    function _footerState(context) {
        this.transitionable.transform.setTranslate([originTranslate(context.size[0], 0.5), context.size[1] * (7 / 8) + context.size[1] * (1 / 8) * 0.5, 0]);
        this.transitionable.size.set([context.size[0], context.size[1] * (1 / 8)]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([.5, .5]);
    }

    function _modalState(context) {
        this.transitionable.transform.setTranslate([originTranslate(context.size[0], 0.5), originTranslate(context.size[1], 0.5), 0]);
        this.transitionable.size.set([context.size[0], context.size[1] * (1 / 8)]);
        this.transitionable.opacity.set(1);
        this.transitionable.origin.set([.5, .5]);
    }

    Modifier.prototype.setState = function (context, elements, trans) {
        console.log('mainLayout');
        if (!context) return;
        var header = elements[0];
        var content = elements[1];
        var footer = elements[2];
        var modal = elements[3];
        _headerState.call(header, context);
        _contentState.call(content, context);
        _footerState.call(footer, context);
        if (modal) _modalState.call(modal, context);
    }
    module.exports = Modifier;
})
