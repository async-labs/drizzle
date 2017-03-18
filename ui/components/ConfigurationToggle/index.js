import React, { PropTypes } from 'react';
import { ConfigurationBox, Toggle } from '../';

const ConfigurationToggle = ({
  name,
  nameStyle,
  inputName,
  toggled,
  onToggle,
  children,
  helpElement,
  ...props }) => (
  <ConfigurationBox
    title={name}
    titleStyle={nameStyle}
    subtitle={helpElement}
    collapsed={toggled}
    elementRight={
      <Toggle
        checked={toggled}
        name={inputName}
        style={{ marginTop: 4 }}
        onToggle={onToggle}
        {...props}
      />
    }
  >
    {children}
  </ConfigurationBox>
);

ConfigurationToggle.propTypes = {
  name: PropTypes.string.isRequired,
  nameStyle: PropTypes.object,
  inputName: PropTypes.string,
  toggled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  helpElement: PropTypes.node,
  children: PropTypes.node,
};

export default ConfigurationToggle;
