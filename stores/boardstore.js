/*global*/

'use strict';

var createStore = require('fluxible/addons').createStore;

var BoardStore = createStore({
  storeName: 'BoardStore',

  refresh: function () {

  }
});

module.exports = BoardStore;
