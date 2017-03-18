import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Button from '../Button';

const FacebookButton = ({ className, ...props }) => (
  <Button
    className={classnames('drizzle-facebook-button', className)}
    btnStyle={'facebook'}
    iconLeft={
      <i className="fa fa-facebook-official fa-lg" />
    }
    {...props}
  />
);

FacebookButton.propTypes = {
  className: PropTypes.string,
};

export default FacebookButton;
