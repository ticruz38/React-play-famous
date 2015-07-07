/*global*/

'use strict';

var createStore = require('fluxible/addons').createStore;

var BoardStore = createStore({

  storeName: 'BoardStore',

  initialize: function () {
    this.data = {
      restaurantName: '',
      genre: '',
      description: '',
    };
  }

});

module.exports = BoardStore;
