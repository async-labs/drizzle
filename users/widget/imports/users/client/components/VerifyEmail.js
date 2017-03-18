import React, { PropTypes } from 'react';

import { Button } from '/imports/ui/components';

const styles = {
  root: {
    padding: '5px 10px',
    backgroundColor: 'rgba(240, 173, 78, 0.11)',
    display: 'flex',
    alignItems: 'center',
  },
  verificationMessage: {
    flex: 1,
    height: 10,
  },
};

const VerifyEmail = ({ sendVerifyEmail }) => (
  <div style={styles.root}>
    <p style={styles.verificationMessage}>Email verification pending</p>
    <Button
      label={'Resend email'}
      onClick={sendVerifyEmail}
      btnSize={'small'}
      btnStyle={'warning'}
    />
  </div>
);

VerifyEmail.propTypes = {
  sendVerifyEmail: PropTypes.func,
};

export default VerifyEmail;
