import React from 'react';
import Reflux from 'reflux';

import AppActions from '../actions/actions';
import AppStore from '../stores/store';

// load all icon definitions
import icons from 'html!../images/icons.html'

var App = React.createClass({

  render() {
    return (
      <div>
        <div id="icons" dangerouslySetInnerHTML={{__html: icons}} />
        Hello worlds
      </div>
    );
  }

});

export default App;