import React, { PropTypes, Component } from 'react';
import { _ } from 'meteor/underscore';

export default class ChartCanvas extends Component {
  componentDidMount() {
    const { data, chartOptions } = this.props;

    const options = _.extend({
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    }, chartOptions);

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');

      Chart.defaults.global.defaultFontSize = 16; // eslint-disable-line no-undef
      this.chart = new Chart(ctx, { // eslint-disable-line no-undef
        type: 'bar',
        data,
        options,
      });
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  render() {
    return (
      <canvas
        className="wh80i"
        ref={node => {
          this.canvas = node;
        }}
      >
      </canvas>
    );
  }
}

ChartCanvas.propTypes = {
  data: PropTypes.object.isRequired,
  chartOptions: PropTypes.object,
};
