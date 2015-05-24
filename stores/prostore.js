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
          picture: '/public/images/drink.jpg'
        }];
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
