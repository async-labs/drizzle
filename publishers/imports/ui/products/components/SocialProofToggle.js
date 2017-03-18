import React, { PropTypes } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
} from '/imports/ui/components';

const SocialProofToggle = ({ onToggle, onSubmit, toggled, value }) => (
  <ConfigurationToggle
    name="Social Proof"
    toggled={toggled}
    onToggle={onToggle}
  >
    <ConfigurationInput
      name="Message"
      value={value}
      onSubmit={onSubmit}
      placeholder="people have purchased on this website"
      style={{
        width: 300,
      }}
    />
  </ConfigurationToggle>
);

SocialProofToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default SocialProofToggle;
