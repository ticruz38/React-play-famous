/*global*/

'use strict';
var createStore = require('fluxible/addons').createStore;

var ProStore = createStore({

  storeName: 'ProStore',

  handlers: {
    'Login': 'handleLogin',
  },

  initialize: function() {
    this.items = [{
      name: 'drink',
      picture: '/public/images/drink.jpg',
      childs: [{
        name: 'Coca',
        picture: '/public/icons/picture.png',
        id: 'abcde'
      }],
      id: 'abcd'
    }];
    this.focus = null;
  },

  remove: function(id, focus) {
    if(!focus.active) {
      this.items.splice(id, 1);
    } else {
      this.items[focus.index].childs.splice(id, 1);
    }
    console.log(this.items);
    this.emitChange();
  },

  add: function(item, focus) {
    if (!focus.active) {
      this.items = this.items.concat([item]);
    } else {
      console.log(this.items[focus.index]);
      this.items[focus.index].childs = this.items[focus.index].childs.concat([item]);
    }
    this.emitChange();
  },

  superFocus: function(item, path) {
    this.focus = item;
    this.focus.path = path;
    this.emitChange();
  },

  unSuperFocus: function(item) {
    var path = this.focus.path;
    this.items[path[0]].childs[path[1]] = item;
    console.log(item, this.items[path[0]].childs[path[1]]);
    this.focus = null;
    this.emitChange();
  },

  getState: function() {
    return {
      items: this.items,
      focus: this.focus
    };
  },

  dehydrate: function() {
    return this.getState();
  },

  rehydrate: function(details) {
    this.items = details.items;
    this.emitChange();
  }
});

module.exports = ProStore;
