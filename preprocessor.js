// preprocessor.js
var React = require('react/addons');
var ReactTools = React.TestUtils;
module.exports = {
  process: function(src) {
    return ReactTools.transform(src);
  }
};
