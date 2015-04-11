// load all styles
require('./styles/main.less');

var React = require('react');
var App = require('./components/App.jsx');

React.render(<App />, document.getElementById('app'));