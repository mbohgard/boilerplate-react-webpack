import React from 'react';
import Reflux from 'reflux';

import AppActions from '../actions/actions';;

export default Reflux.createStore({
  listenables: [AppActions],

  data: {

  },

  /**
   * function to be run on initialization
   * @return undefined
   */
  init() {
    console.log('initializing store...');
  },

  /**
   * called on getAll action trigger
   * @return undefined
   */
  onGetAll() {
    console.log('getAll action triggered')
  }

});