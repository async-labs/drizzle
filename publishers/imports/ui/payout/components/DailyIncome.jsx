import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';

export default class Payout extends Component {
  constructor(props) {
    super(props);

    this.handleSelectedDateChange = this.handleSelectedDateChange.bind(this);
  }

  handleSelectedDateChange(newDate) {
    const { changeSelectedDate } = this.props;

    return changeSelectedDate(moment(newDate, 'DD/MM/YYYY').startOf('day')._d);
  }

  render() {
    const { income, selectedDate } = this.props;

    let text = moment(selectedDate.beginDate).format('DD/MM/YYYY');
    if (text === moment().format('DD/MM/YYYY')) {
      text = 'Today';
    }

    return (
      <div>
        <h3 className="col-xs-12 text-center">
          {text}'s revenue
        </h3>

        <h2 className="text-center fw600" style={{ color: '#005888' }}>
          {typeof income === 'number' ? `$${income.toFixed(2)}` : '...'}
        </h2>

        <div className="col-md-5 col-md-offset-4">
          <span>Select day: </span>
          <DateTimeField
            dateTime={moment(selectedDate).format('DD/MM/YYYY')}
            format="DD/MM/YYYY"
            viewMode="date"
            mode="date"
            inputFormat="DD/MM/YYYY"
            onChange={this.handleSelectedDateChange}
          />
        </div>
      </div>
    );
  }
}

Payout.propTypes = {
  changeSelectedDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.object.isRequired,
  income: PropTypes.number,
};
