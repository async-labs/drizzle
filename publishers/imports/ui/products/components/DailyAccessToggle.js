import React, { PropTypes } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
} from '/imports/ui/components';

const DailyAccessToggle = ({ onToggle, onSubmit, toggled, value }) => (
  <ConfigurationToggle
    name="Daily Access"
    toggled={toggled}
    onToggle={onToggle}
  >
    <ConfigurationInput
      name="Price of daily access"
      value={value}
      onSubmit={onSubmit}
    />
  </ConfigurationToggle>
);


DailyAccessToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default DailyAccessToggle;
