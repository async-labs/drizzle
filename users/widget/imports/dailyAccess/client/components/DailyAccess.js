import moment from 'moment';
import React, { PropTypes } from 'react';

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

const DailyAccess = ({ dailyAccess }) => {
  if (!dailyAccess) {
    return <span></span>;
  }

  return (
    <div style={styles.root}>
      <span style={styles.message}>
        Your daily access expires at {moment(dailyAccess.endAt).format('DD MMM YYYY hh:mm a')}
      </span>
    </div>
  );
};


DailyAccess.propTypes = {
  dailyAccess: PropTypes.object,
};

export default DailyAccess;
