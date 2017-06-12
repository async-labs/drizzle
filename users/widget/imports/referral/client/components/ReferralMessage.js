import React, { PropTypes } from 'react';

import { Button } from '/imports/ui/components';

const styles = {
  root: {
    padding: '5px 10px',
    backgroundColor: 'rgba(240, 173, 78, 0.11)',
    display: 'flex',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: '15px',
  },
};

const ReferralMessage = ({ onClaimButtonClick, message }) => (
  <div style={styles.root}>
    <span style={styles.message}>{message}</span>

    <Button
      label={'Claim referral'}
      onClick={onClaimButtonClick}
      btnSize={'small'}
      btnStyle={'warning'}
    />
  </div>
);

ReferralMessage.propTypes = {
  onClaimButtonClick: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ReferralMessage;
