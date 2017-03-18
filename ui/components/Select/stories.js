import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import Select from './index';

const options = [
  { label: 'First Option', value: 'First Value' },
  { label: 'Second Option', value: 'Second Value' },
  { label: 'Foo Option', value: 'Foo Value' },
  { label: 'Bar Option', value: 'Bar Value' },
];

storiesOf('Select', module)
  .addDecorator(centered)
  .add('default', () => (
    <Select />
  ))
  .add('with options', () => (
    <Select
      options={options}
    />
  ))
  .add('with options and custom default option label', () => (
    <Select
      defaultOptionLabel={'Pick an option!'}
      options={options}
    />
  ))
  .add('with options and default option disabled', () => (
    <Select
      showDefaultOption={false}
      options={options}
    />
  ));
