import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Button from '../Button';

import './style.scss';

const WidgetFooterBar = ({ className, buttonLabel, callToActionText }) => (
  <div className={classnames('drizzle-footer-bar', className)}>
    <div className="drizzle-container">
      <img
        src="https://s3-us-west-1.amazonaws.com/zenmarket/drizzle-logo.svg?v=1"
        alt="Drizzle Logo"
      />
      <Button
        id={'drizzle-footer-button'}
        label={buttonLabel}
      />
    </div>
    <div className="call-to-action-text">
      <span
        id="drizzle-footer-text"
      >
        {callToActionText}
      </span>
    </div>
    <div
      id="footer-close-button"
      className="close-button"
    >
      <i className="fa fa-times"></i>
    </div>
  </div>
);

WidgetFooterBar.propTypes = {
  className: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  callToActionText: PropTypes.string.isRequired,
};

export default WidgetFooterBar;
