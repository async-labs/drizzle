import React from 'react';

import FreeTrialToggle from '../containers/FreeTrialToggle';
import MonthlySubscriptionToggle from '../containers/MonthlySubscriptionToggle';

const styles = {
  row: {
    padding: '20px 0px',
  },
  col: {
    padding: 0,
    marginTop: 20,
  },
};

export default () => (
  <div className="tab-content package1">
    <h1 style={{ display: 'flex' }}>
      <span style={{ flex: 1 }}>
        Subscriptions
      </span>
    </h1>
    <hr />
    <div className="row" style={styles.row}>
      <div className="col-md-12" style={styles.col}>
        <MonthlySubscriptionToggle />
      </div>
      <div className="col-md-12" style={styles.col}>
        <FreeTrialToggle />
      </div>
    </div>
  </div>
);
