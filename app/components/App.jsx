import React from 'react';
import Reflux from 'reflux';

import AppActions from '../actions/actions';
import AppStore from '../stores/store';

// load all icon definitions
import icons from 'html!../images/icons.html'

export default React.createClass({

  getInitialState() {
    return {
      user: 'world'
    }
  },

  render() {
    return (
      <div>
        <div id="icons" dangerouslySetInnerHTML={{__html: icons}} />
        Hello {this.state.user}!
      </div>
    )
  }

});