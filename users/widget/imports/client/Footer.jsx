import React, { PropTypes } from 'react';
import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

const Footer = ({ loggedIn }) => (
  <div className="drizzle-powered brand">
  </div>
);

Footer.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

function footerComposer(props, onData) {
  if (!Meteor.loggingIn()) {
    onData(null, { loggedIn: !!Meteor.userId() });
  }
}

export default composeWithTracker(footerComposer)(Footer);
