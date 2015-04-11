var Reflux = require('reflux');
var AppActions = require('../actions/actions.js');

var AppStore = Reflux.createStore({
  listenables: [AppActions],

  data: {

  },

  /**
   * function to be run on initialization
   * @return undefined
   */
  init: function () {
    console.log('initializing store...');
  },

});

module.exports = AppStore;