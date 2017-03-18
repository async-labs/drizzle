import React, { PropTypes } from 'react';
import MDClose from 'react-icons/lib/md/close';

const styles = {
  root: {
    width: '100%',
    backgroundColor: '#50b2f1',
    display: 'flex',
    fontWeight: 300,
  },
  headerTitle: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10,
    color: 'white',
  },
  closeButton: {
    height: '100%',
    padding: '8px 10px',
    background: 'transparent',
    border: 0,
    transition: 'background-color 0.15s ease',
    // ':hover': {
    //   backgroundColor: '#5090f1',
    // },
  },
};

const title = (username) => username || 'Welcome to Drizzle';

const WidgetHeader = ({ username }) => (
  <header style={styles.root}>
    <div style={styles.headerTitle}>
      <span> {title(username)} </span>
    </div>
    <button style={styles.closeButton}>
      <MDClose color={'white'} size="1.4em" />
    </button>
  </header>
);

WidgetHeader.propTypes = {
  username: PropTypes.string,
};

export default WidgetHeader;
