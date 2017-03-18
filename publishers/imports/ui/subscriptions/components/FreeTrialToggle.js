import React, { PropTypes } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
} from '/imports/ui/components';

const FreeTrialToggle = ({ onToggle, onSubmit, toggled, value }) => (
  <ConfigurationToggle
    name="Free Trial for Subscriptions"
    toggled={toggled}
    onToggle={onToggle}
  >
    <ConfigurationInput
      name="Enter number of free trial days:"
      subtitle={'Any number between 1 to 30.'}
      value={value}
      onSubmit={onSubmit}
    />
  </ConfigurationToggle>
);

FreeTrialToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default FreeTrialToggle;
