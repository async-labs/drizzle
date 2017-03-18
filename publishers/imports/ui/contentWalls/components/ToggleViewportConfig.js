import React, { PropTypes } from 'react';

import { ConfigurationToggle, ConfigurationInput } from '/imports/ui/components';

const ToggleViewportConfig = ({ onToggle, onSubmit, toggled, value }) => (
  <ConfigurationToggle
    onToggle={onToggle}
    toggled={toggled}
    name={'Enable Paywall only for Mobile'}
  >
    <ConfigurationInput
      name={'Device Width:'}
      onSubmit={width => {
        onSubmit({ toggled, width });
      }}
      value={value}
    />
  </ConfigurationToggle>
);
export default ToggleViewportConfig;
