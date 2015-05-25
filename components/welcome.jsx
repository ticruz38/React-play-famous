
 /*global MainLayout*/

'use strict';
var React = require('react');

var Welcome = React.createClass({
    getInitialState: function () {
        return {};
    },
    handleChange: function (event) {
        MainLayout.searchState();
    },
    render: function() {
        return (
          <input className='search' type='text' onKeyPress={this.handleChange}/>
        );
    }
});

module.exports = Welcome;
