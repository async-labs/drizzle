import React from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import '../Input/style.scss';
import './style.scss';

const DatePickerInput = ({ ...props }) => (
  <DatePicker
    className={'drizzle-input'}
    {...props}
  />
);

export default DatePickerInput;
