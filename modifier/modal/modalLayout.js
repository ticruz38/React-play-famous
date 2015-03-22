define('modalInstance', function (require, exports, module) {

    var View = require('view');
    var ScrollModalLayout = require('scrollModalLayout');
    var GridLayout = require('gridlayout');

    function Modifier(modalView, active, typeView) {
        var that = this;
        this.entityView = new View();
        if (!typeView) {
            this.typeView = new View();
        } else {
            this.typeView = typeView;
        }
        var entityModifier = new ScrollModalLayout({
            scroller: that.entityView,
        });
        this.entityView.setModifier(entityModifier);
        this.typeModifier = new ScrollModalLayout({
            scroller: that.typeView,
            modalSize: [1 / 2, 1 / 2],
            active: active ? active : null
        });
        this.typeView.setModifier(this.typeModifier);
        _resetEntityView.call(this, active);
        modalView.push([this.entityView, this.typeView]);
        console.log(modalView);
        _setModifier(modalView);
        _bindEvents.call(this);
    }

    function _bindEvents() {
        this.typeModifier.sync.on('end', function () {
            this.entityView.removeChilds(this.entities);
            _resetEntityView.call(this, this.typeModifier.active);
        }.bind(this));
    }

    function _resetEntityView(active) {
        this.entities = [];
        active.options.data.entities.forEach(function (doc) {
            var entity = new View({
                template: Template.type,
                data: doc
            });
            this.entities.push(entity);
        }.bind(this));
        this.entityView.push(this.entities);
    }

    function _setModifier(modalView) {
        modalView.setModifier(ModalModifier);
    }

    function _observeTypeView() {
        var active = this.typeModifier.active.data;
        console.log(active);
    }

    //    function _entityTransform() {
    //
    //    }
    //
    //    function _typeTransform() {
    //
    //    }
    //
    //    Modifier.prototype.setState = function (context, elements, trans) {
    //        if (!context) return;
    //        var typeLayout = new ScrollModalLayout({
    //
    //        })
    //    }

    function ModalModifier() {

    }

    ModalModifier.prototype.switchSize = function (view) {
        var i = this.elements.indexOf(view);

    }

    function _setTransform(context, elements) {
        var entities = elements[0];
        var types = elements[1];
        types.transitionable.size.set([context.size[0], context.size[1] / 2]);
        types.transitionable.transform.setTranslate([0, 0, 0]);
        entities.transitionable.size.set([context.size[0], context.size[1] / 2]);
        entities.transitionable.transform.setTranslate([0, context.size[1] / 2, 0]);
    }

    ModalModifier.prototype.setState = function (context, elements, trans) {
        if (!context) return;
        this.elements = elements;
        _setTransform.call(this, context, elements);
    }

    module.exports = Modifier;
})
