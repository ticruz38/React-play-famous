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
          id: 'abcd'
        }];
    },

    remove: function (id) {
      this.items.splice(id, 1);
      this.emitChange();
    },

    add: function (item) {
      this.items = this.items.concat([item]);
      this.emitChange();
    },

    getState: function() {
        return {
            items: this.items
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
