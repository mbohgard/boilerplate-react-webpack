var React = require('react');
var Reflux = require('reflux');

// load all icon definitions
var icons = require('html!../images/icons.html');

var App = React.createClass({

  render: function() {
    return (
      <div>
        <div id="icons" dangerouslySetInnerHTML={{__html: icons}} />
      </div>
    );
  }

});

module.exports = App;