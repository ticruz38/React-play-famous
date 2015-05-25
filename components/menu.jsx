/*global MenuView, MenuLayout*/
'use strict';

var React = require('react/addons');
var Link = require('react-router').Link;

var Menu = React.createClass({

  componentDidMount: function() {
    var ListLayout = require('../famous-modifier/listlayout');
    window.ListLayout = new ListLayout();
    MenuView.setModifier(window.ListLayout);
    var childs = [];
    for (var i = 0; i < document.getElementsByClassName('list-item').length; i++) {
      childs[i] = document.getElementsByClassName('list-item')[i];
      if (i === document.getElementsByClassName('list-item').length - 1) MenuView.setChild(childs);
    }
  },

  switch: function() {
    MenuLayout.switchState();
  },

  render: function () {
    return (
      <div className='list'>
      <Link to='professional-ui' className='list-item' onClick={this.switch}>Professional</Link>
      <span className='list-item'>About</span>
      <span className='list-item'>Settings</span>
      </div>
    );
  }
});

module.exports = Menu;
