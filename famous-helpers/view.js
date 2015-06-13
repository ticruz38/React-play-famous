var OptionsManager = require('famous/core/OptionsManager'),
  ElementOutput = require('famous/core/ElementOutput'), //just used in commit could be replaced by native code
  //Transform = famous/core/Transform, not used
  TransitionableTransform = require('famous/transitions/TransitionableTransform'),
  EventHandler = require('famous/core/EventHandler'),
  Entity = require('famous/core/Entity'),
  Transitionable = require('famous/transitions/Transitionable');

/* A wrapper to add famous magic on reactClass and childrens*/

function View(options) {
  this.options = Object.create(View.DEFAULT_OPTIONS);
  this._optionsManager = new OptionsManager(this.options);
  if (options) this.setOptions(options);

  //set eventing system add prototype function like pipe subscribe...

  this._eventInput = new EventHandler();
  this._eventOutput = new EventHandler();
  this._eventOutput.bindThis(this);

  this.eventForwarder = function eventForwarder(event) {
    this._eventOutput.emit(event.type, event);
  }.bind(this);

  this.id = Entity.register(this);
  this._element = this.options.element ? this.options.element : document.createElement('div');
  this._childElements = [];

  this.transitionable = _setTransitionable.call(this);
  this._cacheChildElements = [];
  this.childListener = {}; //register child events to be applied

  _bindEvents.call(this);
}

View.DEFAULT_OPTIONS = {
  mainView: false,
  //transform: null,
  scroll: null,
  data: [],
  //childTransform: new VerticalLayout(),
};

//reactified

//        function _setElement(options) {
//            if (options.mainview) return;
//            var element;
//            if (options.reactClass) {
//                this.reactComponent = React.render( < options.reactClass / > ,
//                    document.body
//                );
//                element = React.findDomNode(this.reactComponent);
//            } else {
//                element = document.createElement('div'); //for event test should be null if no element;
//                document.body.appendChild(element);
//            }
//            return element;
//        }

//reactified still need to figure out what child is inside of children cb
// function _setChildElements(options) {
//
// }

function _setTransitionable() {
  var transitionable = {
    transform: new TransitionableTransform(),
    size: new Transitionable(),
    opacity: new Transitionable(1),
    fontSize: new Transitionable(0),
    origin: new Transitionable(),
    initialize: false,
    target: this.id
  };
  return transitionable;
}

function _getState() {
  if (this.length === 0) return;
  var states = [];
  this.forEach(function(element, index) {
    var state = {};
    for (var key in element.transitionable) {
      if (key === 'transform' || key === 'size' || key === 'opacity' || key === 'origin') {
        state[key] = element.transitionable[key].get();
      } else if (key === 'initialize' || key === 'target') {
        state[key] = element.transitionable[key];

      } else {
        element.superState = [];
        element.superState.push(key);
        state[key] = element.transitionable[key].get();
      }
    }
    states.push(state);
  });
  return states;
}

function _bindEvents() {
  this._eventInput.on('updateChild', function(child) {
    this._childElements;
  }.bind(this));
}

function _xyNotEquals(a, b) {
  return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
}

//  Attach Famous event handling to document events emanating from target
//    document element.  This occurs just after attachment to the document.
//    Calling this enables methods like #on and #pipe.
function _addEventListeners(target) {
  for (var i in this._eventOutput.listeners) {
    target.addEventListener(i, this.eventForwarder);
  }
}

//  Detach Famous event handling from document events emanating from target
//  document element.  This occurs just before detach from the document.
// function _removeEventListeners(target) {
//     for (var i in this._eventOutput.listeners) {
//         target.removeEventListener(i, this.eventForwarder);
//     }
// }

// a function to handle event on View child Elements. And return View as context in eventHandler

function _handleEvent(type, handler, view) {
  var split = type.split(" ");
  var selectors = [];
  for (var i = 0; i < split.length; i++) {
    i === 0 ? type = split[i] : selectors.push(split[i]);
  }
  selectors.forEach(function(selector, i) {
    var element = view._element.querySelector(selector);
    if (!element) return; //when you change childTemplate, sometimes selector is no longer available
    element.addEventListener(type, handler.bind(view));
  });
}

function _onChild(view) {
    for (var type in this.childListener) {

      view.on(type, this.childListener[type]);

      _handleEvent(type, this.childListener[type], view);
    }
  }
  //Old eventing System

//    View.prototype.on = function (type, handler, id) {
//        if (!id) id = this.id;
//        Spy.on(type, handler, id);
//        Spy.get(id)._element.addEventListener(type, function (event) {
//            Spy.emit(event.type, event, id)
//        });
//    }
//
//    View.prototype.onChild = function (type, handler, id) {
//        this._childListener = true;
//        if (!id) id = this.id;
//        Spy.onChild(id, type, handler);
//    }

View.prototype.on = function on(type, fn) {
  if (this._element) this._element.addEventListener(type, this.eventForwarder);
  this._eventOutput.on(type, fn);
};

View.prototype.removeListener = function removeListener(type, fn) {
  this._eventOutput.removeListener(type, fn);
};

View.prototype.emit = function emit(type, event) {
  if (event && !event.origin) event.origin = this;
  var handled = this._eventOutput.emit(type, event);
  if (handled && event && event.stopPropagation) event.stopPropagation();
  return handled;
};

View.prototype.pipe = function pipe(target) {
  this._eventOutput.pipe(target);
  if (this._element) _addEventListeners.call(this, this._element);
};

View.prototype.unpipe = function unpipe(target) {
  return this._eventOutput.unpipe(target);
};

View.prototype.onChild = function(type, handler) {
  this.childListener[type] = handler;
  this._childElements.forEach(function(el, i) {
    _onChild.call(this, el);
  }.bind(this));
};

View.prototype.render = function() { //function to remove as soon as the library is complete
  return this.id;
};

View.prototype.setOptions = function setOptions(options) {
  this._optionsManager.patch(options);
};

View.prototype.setElement = function setElement(el) {
  if (this._element.parentNode) {
    this._element.parentNode.removeChild(this._element);
  }
  this._element = el;
};

View.prototype.setChild = function setChild(object) {
  if (object.length) {
    this._childElements = []; //remove old childs
    for (var i = 0; i < object.length; i++) {
      var child = object[i];
      if (!(child instanceof View)) {
        child = new View({
          element: child
        });
        this._childElements.push(child);
      } else {
        this._childElements.push(child);
      }
    }
  } else {
    if (!(object instanceof View)) {
      object = new View({
        element: object
      });
      this._childElements.push(object);
    } else {
      this._childElements.push(object);
    }
  }
};

View.prototype.setModifier = function(Modifier) {
  Modifier instanceof Function ? this.modifier = new Modifier() : this.modifier = Modifier;
  this.setState = function(context, child, trans) {
    //this.setState never take transition
    this.modifier.setState(context, child, trans);
  };
  if (this.modifier.commit) {
    this.commitState = function() {
      this.modifier.commitState();
    };
  }
  this.setState(this.context, this._childElements);
  //        this._eventInput.emit('refresh');
};

// View.prototype.push = function (view, index, replace) {
//     if (view instanceof Array) {
//         view.forEach(function (v, i) {
//             if (Spy.setChild(this.id, v.id)) {
//                 this._childElements.push(v);
//             }
//         }.bind(this));
//     } else {
//         if (Spy.setChild(this.id, view.id)) {
//             if (index) {
//                 replace ? this._childElements.splice(index, 1, view) : this._childElements.splice(index, 0, view);
//             } else {
//                 this._childElements.push(view);
//             }
//         }
//     }
//     if (this.setState) this.setState(this.context, this._childElements, true);
// }

// View.prototype.pull = function (view) {
//     Spy.killChild(view.id, true);
// }

View.prototype.removeChilds = function(elements) {
  elements.forEach(function(view) {
    view.remove();
  });
  this._childElements = [];
};

View.prototype.removeChild = function(id) {
  this._childElements.splice(id, 1);
};

// function _remove(el) {
//     if (el.blazeView) Blaze.remove(el.blazeView);
//     if (Spy.isChild(el.id)) Spy.killChild(el.id);
//     if (el._childElements) {
//         el._childElements.forEach(function (view) {
//             view.remove();
//         });
//     }
// }

// View.prototype.remove = function () { // still to try!
//     if (this.onRemove) {
//         console.log('onRemove');
//         this.onRemove(_remove);
//     } else {
//         _remove(this);
//     }
//     this._eventInput.emit('refresh');
// }

View.prototype.commit = function(context) {
  this.context = context;
  var target = this._element;
  var size = context.size;
  var length = this._childElements.length;
  if (this._length !== length) {
    this._length = length;
    if (this.setState) this.setState(context, this._childElements);
  }
  if (_xyNotEquals(this._size, size) || _xyNotEquals(this._target, target)) {
    if (!this._size) this._size = [0, 0];
    if (!this._target) this._target = target;
    this._size[0] = size[0];
    this._size[1] = size[1];
    this._sizeDirty = true;
    if (this.setState) this.setState(context, this._childElements);
  }
  if (this._sizeDirty && target) {
    if (this._size) {
      target.style.width = this._size[0] + 'px';
      target.style.height = this._size[1] + 'px';
    }
    this._sizeDirty = false;
  }
  if (this.superState) { //superState indique if there is more style to display on target
    var superState = this.superState;
    superState.forEach(function(key) {
      if (this[key] !== context[key]) {
        target.style[key] = context[key] + 'px';
        this[key] = context[key];
      }
    }.bind(this));
  }
  ElementOutput.prototype.commit.call(this, context);
  if (this.commitState) this.commitState(); // update childElement State at every commit

  return {
    size: size,
    target: _getState.call(this._childElements)
  };
};

module.exports = View;
