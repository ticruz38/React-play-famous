        var famous = require('famous');

        var OptionsManager = famous.core.OptionsManager,
            ElementOutput = famous.core.ElementOutput, //just used in commit could be replaced by native code
            Transform = famous.core.Transform,
            TransitionableTransform = famous.transitions.TransitionableTransform,
            EventHandler = famous.core.EventHandler,
            Entity = famous.core.Entity,
            Transitionable = famous.transitions.Transitionable;

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
            this._element = options.element;
            this._childElements = [];

            this.transitionable = _setTransitionable();
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
        }

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
        function _setChildElements(options) {

        }

        function _setTransitionable() {
            var transitionable = {
                transform: new TransitionableTransform(),
                size: new Transitionable(),
                opacity: new Transitionable(1),
                origin: new Transitionable(),
                initialize: false,
                target: this.id
            };
            return transitionable;
        }

        function _getState() {
            if (this.length === 0) return;
            var states = [];
            this.forEach(function (element, index) {
                var state = {
                    transform: element.transitionable.transform.get(),
                    size: element.transitionable.size.get(),
                    origin: element.transitionable.origin.get(),
                    opacity: element.transitionable.opacity.get(),
                    target: element.id
                }
                states.push(state);
            });
            return states;
        }

        function _bindEvents() {
            this._eventInput.on('updateChild', function (child) {
                this._childElements
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
        function _removeEventListeners(target) {
            for (var i in this._eventOutput.listeners) {
                target.removeEventListener(i, this.eventForwarder);
            }
        }

        // a function to handle event on View child Elements. And return View as context in eventHandler

        function _handleEvent(type, handler, view) {
            var split = type.split(" ");
            var selectors = [];
            var type;
            for (var i = 0; i < split.length; i++) {
                i == 0 ? type = split[i] : selectors.push(split[i]);
            }
            selectors.forEach(function (selector, i) {
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

        View.prototype.onChild = function (type, handler) {
            this.childListener[type] = handler;
            this._childElements.forEach(function (el, i) {
                _onChild.call(this, el);
            }.bind(this));
        }

        View.prototype.render = function () { //function to remove as soon as the library is complete
            return this.id;
        }

        View.prototype.setOptions = function setOptions(options) {
            this._optionsManager.patch(options);
        };

        View.prototype.setData = function (data, templates) {
            var that = this;
            if (this.handle) {
                this.handle.stop();
                this.removeChilds(this);
            }
            var handle = data.observe({
                addedAt: function (doc, atIndex, before) {
                    var options = {
                        template: templates ? templates[atIndex] : that.options.childTemplates,
                        data: doc
                    };
                    var addedView = new View(options);
                    that.push(addedView, atIndex);
                    if (that.setState) that.setState(that.context, that._childElements);
                    _onChild.call(that, addedView); // setting by default but should'nt
                },
                removedAt: function (doc, atIndex, before) {
                    var removedView = that._childElements[atIndex];
                    removedView.remove();
                }
            });
            this.handle = handle;
        }

        View.prototype.setModifier = function (Modifier) {
            var modifier;
            Modifier instanceof Function ? modifier = new Modifier() : modifier = Modifier;
            this.setState = function (context, elements, transition) {
                modifier.setState(context, elements, transition);
            }
            if (modifier.commit) {
                this.commitState = function () {
                    modifier.commitState();
                }
            }
            this.setState(this.context, this._childElements);
            //        this._eventInput.emit('refresh');
        }

        View.prototype.setChildTemplate = function (template) {
            if (this._childElements) this._childElements.forEach(function (view, i) {
                view.setTemplate(template);
                _onChild.call(this, view);
                this._eventInput.emit('refresh');
            }.bind(this));
        }

        View.prototype.setTemplate = function (template) {
            var blazeView;
            var element;
            if (this.options.data) {
                blazeView = Blaze.renderWithData(template, this.options.data, document.body, this._element);
                element = blazeView.firstNode();
            } else {
                blazeView = Blaze.render(template, document.body, this._element);
                element = blazeView.firstNode();
            }
            if (this.blazeView) {
                Blaze.remove(this.blazeView);
            } else {
                document.body.removeChild(this._element);
            }
            this.blazeView = blazeView
            this._element = element;
            this._eventInput.emit('refresh');
        }

        View.prototype.push = function (view, index, replace) {
            if (view instanceof Array) {
                view.forEach(function (v, i) {
                    if (Spy.setChild(this.id, v.id)) {
                        this._childElements.push(v);
                    }
                }.bind(this));
            } else {
                if (Spy.setChild(this.id, view.id)) {
                    if (index) {
                        replace ? this._childElements.splice(index, 1, view) : this._childElements.splice(index, 0, view);
                    } else {
                        this._childElements.push(view);
                    }
                }
            }
            if (this.setState) this.setState(this.context, this._childElements, true);
        }

        View.prototype.pull = function (view) {
            Spy.killChild(view.id, true);
        }

        View.prototype.removeChilds = function (elements) {
            elements.forEach(function (view) {
                view.remove();
            });
            this._childElements = [];
        }

        function _remove(el) {
            if (el.blazeView) Blaze.remove(el.blazeView);
            if (Spy.isChild(el.id)) Spy.killChild(el.id);
            if (el._childElements) {
                el._childElements.forEach(function (view) {
                    view.remove();
                });
            }
        }

        View.prototype.remove = function () { // still to try!
            if (this.onRemove) {
                console.log('onRemove');
                this.onRemove(_remove);
            } else {
                _remove(this);
            }
            this._eventInput.emit('refresh');
        }

        View.prototype.commit = function (context) {
            this.context = context;
            var target = this._element;
            var size = context.size;
            var length = this._childElements.length;
            if (this._length !== length) {
                this._length = length;
                if (this.setState) this.setState(context, this._childElements, true);
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
            ElementOutput.prototype.commit.call(this, context);
            if (this.commitState) this.commitState(); // update childElement State at every commit
            return {
                transform: context.transform,
                size: context.size,
                opacity: context.opacity,
                target: _getState.call(this._childElements)
            }
        }

        module.exports = View;
