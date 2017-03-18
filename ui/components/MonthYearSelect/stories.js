import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import MonthYearSelect from './';

storiesOf('MonthYearSelect', module)
  .addDecorator(centered)
  .add('with minYear 2015 and maxYear 2016', () => (
    <MonthYearSelect
      minYear={2015}
      maxYear={2016}
      onDateChange={(date) => action(date)}
    />
  ));
