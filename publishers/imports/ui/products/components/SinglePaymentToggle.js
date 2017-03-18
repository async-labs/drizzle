import React, { PropTypes } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
} from '/imports/ui/components';


const ToggleSinglePayment = ({ onToggle, onSubmit, toggled, value }) => (
  <ConfigurationToggle
    name="Single Payment"
    toggled={toggled}
    onToggle={onToggle}
  >
    <ConfigurationInput
      name="Price (Default price of content: $0.25-$10.00)"
      value={value}
      onSubmit={onSubmit}
    />
  </ConfigurationToggle>
);


ToggleSinglePayment.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default ToggleSinglePayment;
