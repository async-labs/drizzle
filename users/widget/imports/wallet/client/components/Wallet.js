import React, { PropTypes } from 'react';
import SubscribeButton from '../../../subscription/client/containers/SubscribeButton.jsx';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

const styles = {
  root: {
  },
  hr: {
    marginTop: '0px',
  },
};

const Wallet = ({ amount, product, walletBalance, depositBalance, isOwner }) => {
  let deposit = null;
  if (depositBalance) {
    deposit = (
      <div className="card">
        <p className="margin-10 left">
          Wallet balance
          <i className="fa fa-question-circle" data-tip="Money sent to you by Drizzle. Hooray!">
          </i>:
          <span className="balance-color">
            ${(depositBalance / 100).toFixed(2)}
          </span>
        </p>
      </div>
    );
  }

  // TODO: Create logo component
  if (!product.paygEnabled) {
    const image = product.widgetUI && product.widgetUI.image || 'https://zenmarket.s3-us-west-1.amazonaws.com/widget-images/xWPM58b6wFaWYkRBm/custom-widget.png';
    return (
      <div className="text-center">
       {deposit}
        <img
          src={image}
          className="h-120"
          role="presentation"
        />
        <hr style={styles.hr} />
      </div>
   );
  }

  const chargeDay = new Date();
  chargeDay.setDate(25);
  const now = new Date();

  if (now.getTime() > chargeDay.getTime()) {
    chargeDay.setMonth(chargeDay.getMonth() + 1);
  }
  const chargeDayFormat = moment(chargeDay).format('M/DD/YYYY');
  const tipMessage = `Your card is charged when a total of your single payments on all websites is $1 or greater.
  Otherwise, it is charged on ${chargeDayFormat}.`;
  return (
    <div style={styles.root}>
      {deposit}
      <p> Your monthly spend on: </p>
      <hr style={styles.hr} />

      <p style={{ color: '#222' }}>
        This Website:
        <span style={{ float: 'right' }}>${amount / 100}</span>
      </p>


      <p style={{ color: '#222' }} >
        Other Websites:
       <span style={{ float: 'right' }}>${walletBalance / 100}</span>
      </p>

      <hr style={{ marginTop: '20px', marginBottom: '8px' }} />

      <SubscribeButton />
      <ReactTooltip />
    </div>
  );
};

Wallet.propTypes = {
  product: PropTypes.object.isRequired,
  amount: PropTypes.number.isRequired,
  walletBalance: PropTypes.number.isRequired,
  depositBalance: PropTypes.number.isRequired,
  isOwner: PropTypes.bool,
};

export default Wallet;
