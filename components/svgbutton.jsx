/*global MenuLayout*/

'use strict';

var React = require('react/addons');

var Button = React.createClass({

  onBurgerClicked: function () {
  },

  render: function () {
    return (
      <svg onClick = {this.onBurgerClicked} className = 'burger-button'  width="30" height="30" viewBox='0 0 30 30'>
        <path strokeWidth='3' stroke='black' d='M0 5 H 30 M0 15 H 30 M0 25 H 30'/>
      </svg>
    );
  }
});

module.exports = Button;
