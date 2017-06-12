import React from 'react';
import { composeWithTracker } from 'react-komposer';

import { ConfigurationToggle } from '/imports/ui/components';
import { toggleMeteredPaywall } from '../actions';

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    name: 'Metered Paywall',
    toggled: !wall.disableMeteredPaywall,
    helpElement: (
      <span>
        Enable/disable "free unlocks" for this paywall.
      </span>
    ),
    onToggle(toggled) {
      toggleMeteredPaywall({
        wallId: wall._id,
        state: !toggled,
      });
    },
  });
}

export default composeWithTracker(composer)(ConfigurationToggle);
