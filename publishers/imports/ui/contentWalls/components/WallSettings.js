import React from 'react';

import ConfigUpsell from '../../upselling/containers/Config';
import SocialProofToggle from '../../products/containers/SocialProofToggle';
import SinglePaymentToggle from '../../products/containers/SinglePaymentToggle';
import MailchimpForm from '../../mailchimp/containers/MailchimpForm';
import StripeForm from '../../stripe/containers/StripeForm';
import ToggleFooterBar from '../../products/containers/ToggleFooterBar';

const styles = {
  row: {
    padding: '20px 0px',
  },
  col: {
    padding: 0,

    marginTop: 20,
  },
};

const WallSettings = () => (
  <div className="tab-content package1">
    <h1 style={{ display: 'flex' }}>
      <span style={{ flex: 1 }}>
        Wall Setup
      </span>
    </h1>
    <hr />
    <div className="row" style={styles.row}>
      <div className="col-md-12" style={styles.col}>
        <SinglePaymentToggle />
      </div>
      <div className="col-md-12" style={styles.col}>
        <SocialProofToggle />
      </div>
      <div className="col-md-12" style={styles.col}>
        <ConfigUpsell />
      </div>
      <div className="col-md-12" style={styles.col}>
        <ToggleFooterBar />
      </div>
      <div className="col-md-12" style={styles.col}>
        <MailchimpForm />
      </div>
      <div className="col-md-12" style={styles.col}>
        <StripeForm />
      </div>
    </div>
  </div>
);

export default WallSettings;
