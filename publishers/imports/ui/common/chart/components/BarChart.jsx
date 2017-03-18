import React, { PropTypes, Component } from 'react';

import ChartCanvas from './ChartCanvas.jsx';


export default class BarChart extends Component {
  constructor(props) {
    super(props);

    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }

  prevMonth(event) {
    event.preventDefault();

    const { changePeriod } = this.props;
    changePeriod(1);
  }

  nextMonth(event) {
    event.preventDefault();

    const { changePeriod } = this.props;
    changePeriod(-1);
  }

  render() {
    const {
      period,
      data,
      chartOptions,
      hideChart,
      prevPeriodText = 'Prev Month',
      nextPeriodText = 'Next Month',
    } = this.props;

    let next = (
      <span>
        {nextPeriodText} <i className="fa fa-arrow-right" aria-hidden="true"></i>
      </span>
    );

    if (period > 0) {
      next = (
        <a href="#" onClick={this.nextMonth}>
          {nextPeriodText} <i className="fa fa-arrow-right" aria-hidden="true"></i>
        </a>
      );
    }

    const prev = (
      <a href="#" onClick={this.prevMonth}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i> {prevPeriodText}
      </a>
    );

    let chart = (<span>loading chart data...</span>);
    if (data) {
      chart = <ChartCanvas data={data} chartOptions={chartOptions} />;
    }

    return (
      <div>
        <p>{prev} | {next}</p>
        {!hideChart ? chart : null}
      </div>
    );
  }
}

BarChart.propTypes = {
  data: PropTypes.object,
  chartOptions: PropTypes.object,
  period: PropTypes.number.isRequired,
  changePeriod: PropTypes.func.isRequired,
  hideChart: PropTypes.bool,
  nextPeriodText: PropTypes.string,
  prevPeriodText: PropTypes.string,
};
