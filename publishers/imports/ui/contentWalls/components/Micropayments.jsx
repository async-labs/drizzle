import React, { PropTypes } from 'react';
import moment from 'moment';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Button } from '/imports/ui/components';

import BarChart from '../../common/chart/components/BarChart.jsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Micropayments({
  product,
  datePeriod,
  totalEarned,
  totalEarnedMonth,
  totalEarnedToday,
  changePeriod,
  period,
  chartData,
  isVerified,
}) {
  if (!product) {
    return <span></span>;
  }

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

  let endDate = moment(datePeriod.endDate).format('DD/MM/YYYY');
  if (moment().isBefore(datePeriod.endDate)) {
    endDate = 'Today';
  }

  let total = '';
  if (!isNaN(Number(totalEarnedMonth))) {
    total = (
      <span className="fw600">
        Total earned from {moment(datePeriod.beginDate).format('DD/MM/YYYY')} - {endDate}
        : ${(totalEarnedMonth).toFixed(2)}
      </span>
    );
  }

  return (
    <div className="tab-content package1">
      <div className="row">
        <div>
          <h2 className="col-xs-12 text-center gray-title">Single payments
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
          <h4 className="col-xs-12 text-center">
            {total}
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <table>
            <tbody>
              <tr>
                <td>Total earned in single payments today:</td>
                <td>${(totalEarnedToday).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total earned in single payments as of today:</td>
                <td>${(totalEarned / 100).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
          <BarChart data={chartData} changePeriod={changePeriod} period={period} />
        </div>
      </div>
    </div>
  );
}

Micropayments.propTypes = {
  product: PropTypes.object.isRequired,
  isVerified: PropTypes.bool.isRequired,
  chartData: PropTypes.object,
  totalEarnedMonth: PropTypes.number,
  totalEarned: PropTypes.number.isRequired,
  period: PropTypes.number.isRequired,
  changePeriod: PropTypes.func.isRequired,
  datePeriod: PropTypes.object.isRequired,
  totalEarnedToday: PropTypes.number.isRequired,
};
