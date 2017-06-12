import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { MonthYearSelect } from '/imports/ui/components';

import {
  OverlayTrigger,
  Tooltip as BSTooltip,
} from 'react-bootstrap';

import DailyAccessCharges from '../../dailyAccess/containers/DailyAccessCharges';

import DailyIncome from '../containers/DailyIncome';
import SinglePayments from '../containers/SinglePayments';
import SubscriptionList from '../containers/SubscriptionList';

const Tooltip = ({ text }) => (
  <OverlayTrigger
    placement="top"
    overlay={
      <BSTooltip id="tooltip">
        <strong>
          {text}
        </strong>
      </BSTooltip>
    }
  >
    <a href="#"><i className="fa fa-info-circle" aria-hidden="true"></i></a>
  </OverlayTrigger>
);

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
};

export default class Payout extends Component {
  constructor(props) {
    super(props);

    this.handleChangeMonth = this.handleChangeMonth.bind(this);
  }

  handleChangeMonth(dateString) {
    const { changeMonth } = this.props;
    return changeMonth(moment(dateString));
  }

  renderVerifyMessage() {
    return (
      <div className="tab-content package1">
        <div className="row">
          <h2 className="col-xs-12 text-center gray-title">Total payout</h2>
          <h4 className="col-xs-12 text-center">
            <p>
              Please verify your ownership by
              adding API key to your Wordpress site
              or adding script to your non-Wordpress site.
            </p>
            <p>
              <a href="/setup">Go to Setup</a>
            </p>
          </h4>
        </div>
      </div>
    );
  }

  render() {
    const {
      product,
      monthPeriod,
      isVerified,

      wallIncome,
      subscriptionIncome,
      dailyAccessIncome,
      totalIncome,

      monthIncome,
      incomeAfterStripeFee,
    } = this.props;

    if (!product) {
      return <span></span>;
    }

    if (!isVerified) {
      return this.renderVerifyMessage();
    }

    let total = '';
    if (!isNaN(Number(monthIncome))) {
      total = (
        <h3 className="col-xs-12 text-center">
          {moment(monthPeriod.beginDate).format('MMMM YYYY')}'s revenue
        </h3>
      );
    }

    return (
      <div className="tab-content package1">
        <div className="row">
          <h2 className="col-xs-12 text-center gray-title">Total payout</h2>
        </div>
        <div className="row">
          <div className="col-md-6">
            <DailyIncome />
          </div>
          <div className="col-md-6">
            <div>
              {total}

              <h2 className="text-center fw600">
                <span style={{ color: '#005888', marginRight: '10px' }}>
                  {typeof monthIncome === 'number' ? `$${monthIncome.toFixed(2)}` : null}
                </span>

                <span>|</span>

                <span style={{ color: '#005888', marginLeft: '10px' }}>
                  {typeof incomeAfterStripeFee === 'number'
                    ? `$${incomeAfterStripeFee.toFixed(2)} ` : null}

                  {incomeAfterStripeFee ?
                    <span style={{ fontSize: '16px' }}>
                      <Tooltip
                        text="Stripe fee is 2% + $0.30 per charge.
                          Drizzle makes no money off Stripe fee."
                      />
                    </span>
                    : null}
                </span>
              </h2>

              <div className="col-md-5 col-md-offset-4">
                <span>Select month: </span>
                <div>
                  <MonthYearSelect
                    onDateChange={this.handleChangeMonth}
                    defaultOptionLabel={'Select a month...'}
                    minYear={product.createdAt.getFullYear()}
                    maxYear={new Date().getFullYear()}
                    defaultValue={moment(monthPeriod.beginDate).format('YYYY-MM-DD')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SubscriptionList monthPeriod={monthPeriod} product={product} />
        <SinglePayments monthPeriod={monthPeriod} product={product} />
        {product.isDailyAccessEnabled() ?
          <DailyAccessCharges monthPeriod={monthPeriod} product={product} />
          : null}

        <div className="row">
          <div className="col-xs-12">
            <table>
              <tbody>
                <tr>
                  <td>Total via single payments as of today:</td>
                  <td>${(wallIncome / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Total via paid subscriptions as of today:</td>
                  <td>${(subscriptionIncome / 100).toFixed(2)}</td>
                </tr>
                {product.isDailyAccessEnabled() ?
                  <tr>
                    <td>Total via paid daily accesses as of today:</td>
                    <td>${(dailyAccessIncome / 100).toFixed(2)}</td>
                  </tr> : null}
                <tr>
                  <td>Total via all channels as of today:</td>
                  <td>${(totalIncome / 100).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

Payout.propTypes = {
  product: PropTypes.object.isRequired,
  isVerified: PropTypes.bool.isRequired,

  subscriptionIncome: PropTypes.number.isRequired,
  wallIncome: PropTypes.number.isRequired,
  dailyAccessIncome: PropTypes.number.isRequired,
  totalIncome: PropTypes.number.isRequired,

  monthIncome: PropTypes.number,
  incomeAfterStripeFee: PropTypes.number,
  monthPeriod: PropTypes.object.isRequired,
  changeMonth: PropTypes.func.isRequired,
};
