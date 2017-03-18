import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './style.scss';

class Input extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { fullWidth, className, ...props } = this.props;
    return (
      <input
        className={classNames(
          'drizzle-input',
          fullWidth && 'full-width',
          className
        )}
        {...props}
      />
    );
  }
}

Input.propTypes = {
  /**
   * If true, add a full-width class to the element.
   */
  fullWidth: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

Input.defaultProps = {
  fullWidth: false,
};

export default Input;
