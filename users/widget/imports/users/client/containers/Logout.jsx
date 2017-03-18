import React from 'react';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { get as getCurrentUrl } from '/imports/products/client/currentUrl';
import sendCommand from '/imports/communicateWithWidget/client/sendCommand';

export default React.createClass({
  componentDidMount() {
    if (Meteor.isClient) {
      Meteor.logout(() => {
        FlowRouter.go('/login');
        sendCommand({
          url: getCurrentUrl(),
          name: 'logout',
        });
      });
    }
  },

  render() {
    return (
      <div className="text-center">Logged out.</div>
    );
  },
});
