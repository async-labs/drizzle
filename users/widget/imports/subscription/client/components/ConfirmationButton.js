import React, { PropTypes } from 'react';
import { Button } from '/imports/ui/components';

const styles = {
  button: {
    width: 80,
  },
  cancelButton: {
    marginRight: 10,
  },
};

const ConfirmationButton = ({ onClickConfirm, onClickCancel }) => (
  <div>
    <Button
      label={'Go back'}
      btnSize={'small'}
      onClick={onClickCancel}
      style={{
        ...styles.button,
        ...styles.cancelButton,
      }}
    />
    <Button
      label={'I confirm'}
      btnSize={'small'}
      onClick={onClickConfirm}
      style={styles.button}
    />
  </div>
);

ConfirmationButton.propTypes = {
  onClickConfirm: PropTypes.func.isRequired,
  onClickCancel: PropTypes.func.isRequired,
};

export default ConfirmationButton;
