import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import DatePickerInput from './index';

storiesOf('DatePickerInput', module)
  .addDecorator(centered)
  .add('default', () => (
    <DatePickerInput />
  ));
