import React, { PropTypes } from 'react';
import Button from '../Button';

const SubmitButton = ({ label, isSubmiting, submitingLabel, ...props }) => (
  <Button
    label={isSubmiting ? submitingLabel || label : label}
    type={'submit'}
    disabled={isSubmiting}
    iconRight={isSubmiting && (<i className="fa fa-spinner fa-pulse fa-fw"></i>)}
    {...props}
  />
);

SubmitButton.propTypes = {
  label: PropTypes.string.isRequired,
  submitingLabel: PropTypes.string,
  isSubmiting: PropTypes.bool.isRequired,
};

SubmitButton.defaultProps = {
  isSubmiting: false,
};

export default SubmitButton;
