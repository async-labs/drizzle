import React, { PropTypes } from 'react';
import classnames from 'classnames';

import './style.scss';

const Button = ({
  label,
  className,
  iconRight,
  iconLeft,
  btnStyle,
  btnSize,
  fullWidth,
  ...props,
}) => (
  <button
    className={classnames(
      'drizzle-button',
      btnStyle,
      btnSize,
      fullWidth && 'full-width',
      className
    )}
    {...props}
  >
    {iconLeft && (
      <span
        className={classnames(
        'icon-container',
        label && 'left'
      )}
      >
        {React.cloneElement(iconLeft, {
          className: classnames(
            'icon',
            iconLeft.props.className
          ),
        })}
      </span>
    )}

    {label}

    {iconRight && (
      <span
        className={classnames(
          'icon-container',
          label && 'right'
        )}
      >
        {React.cloneElement(iconRight, {
          className: classnames(
            'icon',
            iconRight.props.className
          ),
        })}
      </span>
    )}
  </button>
);

Button.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  btnStyle: PropTypes.oneOf([
    'default',
    'warning',
    'danger',
    'facebook',
  ]),
  btnSize: PropTypes.oneOf(['small']),
  fullWidth: PropTypes.bool,
};

Button.defaultProps = {
  btnStyle: 'default',
  fullWidth: false,
};

export default Button;
