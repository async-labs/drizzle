import React, { PropTypes } from 'react';

const styles = {
  root: {
    height: 34,
    backgroundColor: 'white',
  },
};

const Select = ({ options, showDefaultOption, defaultOptionLabel, style, ...props }) => (
  <select
    style={{
      ...styles.root,
      ...style,
    }}
    {...props}
  >
    {showDefaultOption && (
      <option>{defaultOptionLabel}</option>
    )}
    {options.map(option => (
      <option value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

Select.propTypes = {
  /**
   * Shows the default option with no value when the component is rendered.
   * Enabled by default.
   */
  showDefaultOption: PropTypes.bool,
  /**
   * Custom text of the default option.
   */
  defaultOptionLabel: PropTypes.string,
  /**
   * Array of options.
   */
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.number,
    ]),
  })),
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
};

Select.defaultProps = {
  defaultOptionLabel: 'Select an option...',
  showDefaultOption: true,
  options: [],
};

export default Select;
