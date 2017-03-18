import React, { PropTypes } from 'react';

import BarChart from '../../common/chart/components/BarChart.jsx';

export default function MonthlyIncomeGraph({
  changePeriod,
  period,
  chartData,
  isVerified,
}) {
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

  return (
    <div className="tab-content package1">
      <div className="row">
        <h2 className="col-xs-12 text-center gray-title">Payout by month</h2>
      </div>
      <div className="text-center">
        <BarChart
          data={chartData}
          changePeriod={changePeriod}
          period={period}
          prevPeriodText="Prev Year"
          nextPeriodText="Next Year"
        />
      </div>
    </div>
  );
}

MonthlyIncomeGraph.propTypes = {
  chartData: PropTypes.object,
  period: PropTypes.number.isRequired,
  changePeriod: PropTypes.func.isRequired,
  isVerified: PropTypes.bool.isRequired,
};
