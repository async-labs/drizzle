import React from 'react';

import PlanList from '../containers/PlanList';
import WeeklySubscriptionToggle from '../containers/WeeklySubscriptionToggle';
import FreeTrialToggle from '../containers/FreeTrialToggle';
import ReferralToggle from '../containers/ReferralToggle';
// import PromoCodeToggle from '../containers/PromoCodeToggle';
import MonthlySubscriptionToggle from '../containers/MonthlySubscriptionToggle';
import AnnualSubscriptionToggle from '../containers/AnnualSubscriptionToggle';

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
        <WeeklySubscriptionToggle />
      </div>
      <div className="col-md-12" style={styles.col}>
        <AnnualSubscriptionToggle />
      </div>
      <div className="col-md-12" style={styles.col}>
        <FreeTrialToggle />
      </div>
      <div className="col-md-12" style={styles.col}>
        <ReferralToggle />
      </div>
    </div>

    <PlanList />
  </div>
);
