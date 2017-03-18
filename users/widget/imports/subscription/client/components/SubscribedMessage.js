import React, { PropTypes } from 'react';

const styles = {
  root: {
    fontSize: '14px',
    textAlign: 'center',
    color: 'green',
    margin: '15px',
  },
};

const SubscribedMessage = ({ message }) => (
  <div style={styles.root}>
    {message}
  </div>
);

SubscribedMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default SubscribedMessage;
