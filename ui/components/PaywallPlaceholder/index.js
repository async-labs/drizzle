import React from 'react';
import './style.scss';

const styles = {
  root: {
    width: '100%',
    padding: '10px',
    textAlign: 'center',
  },
  hr: {
    borderTop: '2px solid #64baeb',
    width: '100%',
    marginBottom: '5px',
  },
  button: {
    borderRadius: '4px',
    border: 'none',
    color: 'white',
    backgroundColor: '#1088cc',
    fontSize: '15px',
    letterSspacing: '0.02em',
    padding: '10px 15px',
    margin: '0 auto',
    height: 'auto !important',
  },
  buttonImg: {
    display: 'inline',
    verticalAlign: 'sub',
    padding: '0px !important',
    background: 'none',
    border: 'none',
    margin: '0px 0px 0px 2px',
  },
};

const PaywallPlaceholder = () => (
  <div style={styles.root}>
    <hr style={styles.hr} />
    <button style={styles.button}>
      Read more&nbsp;
      <img
        style={styles.buttonImg}
        src="https://s3-us-west-1.amazonaws.com/zenmarket/droplet20px.png"
        width="16px"
        alt="Drizzle Logo"
      />
    </button>
  </div>
);

export default PaywallPlaceholder;
