import React, { PropTypes, Component } from 'react';
import moment from 'moment';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Button } from '/imports/ui/components';

import BarChart from '../../common/chart/components/BarChart.jsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class Subscriptions extends Component {
  constructor(props) {
    super(props);

    this.changeSelectedId = this.changeSelectedId.bind(this);
  }

  changeSelectedId(event) {
    const id = event.target.value;

    FlowRouter.setQueryParams({ id });
  }

  renderSelector() {
    const {
      plans,
      selectedPlan,
      paywallCounts,
    } = this.props;

    return (
      <div className="text-center row">
        Select subscription:&nbsp;
        <select
          defaultValue={selectedPlan && selectedPlan._id || ''}
          onChange={this.changeSelectedId}
        >
          {plans.map(p =>
            <option value={p._id} key={p._id}>
              {p.name} (${(p.price / 100).toFixed(2)}/mo, {paywallCounts[p._id] || 0} paywalls)
            </option>)}
        </select>
      </div>
    );
  }

  renderStats() {
    const {
      product,
      selectedPlan,
      datePeriod,
      paywallCounts,
      subscriberCounts,
      unsubscriberCounts,
    } = this.props;

    let endDate = moment(datePeriod.endDate).format('DD/MM/YYYY');
    if (moment().isBefore(datePeriod.endDate)) {
      endDate = 'Today';
    }

    if (!product || !selectedPlan) {
      return <span></span>;
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <table>
              <tbody>
                <tr>
                  <td>Plan:</td>
                  <td>
                    ${(selectedPlan.price / 100).toFixed(2)}/mo
                  </td>
                </tr>
                <tr>
                  <td>Number of paywalls (as of today):</td>
                  <td>
                    {paywallCounts[selectedPlan._id] || 0}
                  </td>
                </tr>
                <tr>
                  <td>Number of subscribers (as of today):</td>
                  <td>
                    {subscriberCounts[selectedPlan._id] || 0}
                  </td>
                </tr>
                <tr>
                  <td>Number of unsubscribers (as of today):</td>
                  <td>
                    {unsubscriberCounts[selectedPlan._id] || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {!isNaN(selectedPlan.totalEarnedMonth) ?
          <div className="row">
            <h4 className="col-xs-12 text-center">
              <span className="fw600">
                Total earned from {moment(datePeriod.beginDate).format('DD/MM/YYYY')} - {endDate}
                : ${(selectedPlan.totalEarnedMonth / 1).toFixed(2)}
              </span>
            </h4>
          </div> : null}
      </div>
    );
  }

  render() {
    const {
      product,
      selectedPlan,
      changePeriod,
      period,
      chartData,
      chartOptions,
      isVerified,
    } = this.props;

    if (!isVerified) {
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

    if (!product || !selectedPlan) {
      return (
        <span>
          Subscription is disabled
        </span>
      );
    }

    return (
      <div className="tab-content package1">
        <div className="row">
          <h2 className="col-xs-12 text-center gray-title">Subscriptions
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip">
                  <strong>
                    Transaction fee of 2% is applied to your monthly payout. No hidden fees.
                  </strong>
                </Tooltip>
              }
            >
              <a href="#"> <i className="fa fa-info-circle" aria-hidden="true"></i></a>
            </OverlayTrigger>
          </h2>
        </div>
        {this.renderSelector()}
        {this.renderStats()}
        <div className="row">
          <div className="text-right">
            <Button
              label="Manage users"
              btnSize={'small'}
              iconRight={<i className="fa fa-users" />}
              onClick={() => FlowRouter.go('/users')}
            />
          </div>
          <div className="col-xs-12 text-center">
            <BarChart
              data={chartData}
              changePeriod={changePeriod}
              period={period}
              chartOptions={chartOptions}
            />
          </div>
        </div>
      </div>
    );
  }
}

Subscriptions.propTypes = {
  product: PropTypes.object.isRequired,
  isVerified: PropTypes.bool.isRequired,
  period: PropTypes.number,
  changePeriod: PropTypes.func,
  datePeriod: PropTypes.object,
  chartData: PropTypes.object,
  chartOptions: PropTypes.object,
  paywallCounts: PropTypes.object,
  subscriberCounts: PropTypes.object,
  unsubscriberCounts: PropTypes.object,
  plans: PropTypes.array,
  selectedPlan: PropTypes.object,
};
