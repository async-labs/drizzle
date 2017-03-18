import React from 'react';
import { composeWithTracker } from 'react-komposer';

// import { Meteor } from 'meteor/meteor';
import { ConfigurationToggle } from '/imports/ui/components';
// import ToggleMicropayment from '../components/ToggleMicropayment.jsx';

import {
  toggleMicropayment,
} from '../actions';

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    name: 'Single Payments',
    helpElement: (
      <span>
        Learn more about our&nbsp;
        <a target="blank" href="http://publishers.getdrizzle.com/">
          single payment
        </a>
      </span>
    ),
    toggled: !wall.disableMicropayment,
    onToggle: (toggled) => {
      toggleMicropayment({
        wallId: wall._id,
        state: !toggled,
      });
    },
  });
}

export default composeWithTracker(composer)(ConfigurationToggle);
