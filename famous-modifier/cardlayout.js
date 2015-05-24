/*global ListLayout */

var Transitionable = require('famous/transitions/Transitionable');

function Modifier() {
    this.activeState = _initialState;
    this.state = 0;
}

var transition = {
    duration: 600,
    curve: 'easeInOut'
};

var color = new Transitionable(30);

function _initialState(trans) {
    this.elements.forEach(function(element, i) {
        // console.log(element._element);
        element.transitionable.origin.set([0.5, 0.5], trans);
        element.transitionable.size.set([this.size[0] / 4, this.size[0] / 4], trans);
        element.transitionable.transform.setTranslate([this.size[0] / 6 * (2 * i + 1), this.size[0] / 8, 0], trans);
        //element._element.style.backgroundColor = 'hsl(' + color.get() + ', 75%, 50%)';
    }.bind(this));

}

function _menuState(trans) {
    this.home.transitionable.size.set([this.size[0] * 0.75, this.size[1] * 0.75], trans);
    this.home.transitionable.transform.setTranslate([(this.size[0] / 2) + (this.size[0] / 4), this.size[1] / 2, 0], trans);
    color.set(90, trans);
    this.home._element.style.backgroundColor = 'hsl(' + color.get() + ', 75%, 50%)'; //need to handle it view commit side
}

Modifier.prototype.setState = function(context, elements) {
    if (!context) return;
    //console.log(context, elements);
    this.elements = elements;
    this.size = context.size;
    this.activeState();
};

Modifier.prototype.switchState = function() {
    ListLayout.switchState();
    this.activeState = this.state ? _initialState : _menuState;
    this.state = !this.state;
    this.activeState(transition);
};

module.exports = Modifier;
