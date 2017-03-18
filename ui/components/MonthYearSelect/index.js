import React, { Component, PropTypes } from 'react';
import Select from '../Select';

/**
 * Pad a number with zeros on the left.
 * Example: 1 --> 01
 */
const padWithZeros = (number) => {
  const numberString = number.toString();
  return numberString.length >= 2
    ? numberString
    : new Array(2 - numberString.length + 1).join(0) + numberString;
};

/**
 * Generates the date formated.
 * Example: 2016-12-14
 */
const generateDateString = (date) => {
  const year = date.getFullYear().toString();
  const month = padWithZeros(date.getMonth() + 1, 2);
  const day = padWithZeros(date.getDate(), 2);
  return `${year}-${month}-${day}`;
};

/**
 * Generate array of options from minYear to maxYear
 * Labels are 'MonthName Year'. Example (December 2016)
 * Values are 'YYYY-MM-DD'
 */
const generateOptions = (minYear, maxYear) => {
  const options = [];
  for (let year = minYear; year <= maxYear; year ++) {
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      options.push({
        label: date.toLocaleString('en-us', {
          year: 'numeric',
          month: 'long',
        }),
        value: generateDateString(date),
      });
    }
  }
  return options;
};

class MonthYearSelect extends Component {
  handleDateChange(event) {
    if (this.props.onDateChange) {
      this.props.onDateChange(event.target.value);
    }
  }
  render() {
    const { minYear, maxYear, ...props } = this.props;
    return (
      <Select
        options={generateOptions(minYear, maxYear)}
        onChange={::this.handleDateChange}
        {...props}
      />
    );
  }
}

MonthYearSelect.propTypes = {
  /**
   * Minimum year to generate the options
   */
  minYear: PropTypes.number.isRequired,
  /**
   * Maximum year to generate the options
   */
  maxYear: PropTypes.number.isRequired,
  /**
   * Returns the option value. E.g (2014-12-01)
   */
  onDateChange: PropTypes.func,
};

export default MonthYearSelect;
