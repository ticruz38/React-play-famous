'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').FluxibleMixin;

var Card = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
      storeListeners: {
        _onChange: []
      }
    },
    getInitialState: function() {
      //first I need to settle the creation of restaurant to get information in database
    },
    handleClick: function() {
        this.setState({
            liked: !this.state.liked
        });
    },
    render: function() {

    }
});

module.exports = Card;
