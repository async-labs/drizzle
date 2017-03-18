import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';
import Input from './index';

storiesOf('Input', module)
  .addDecorator(centered)
  .add('default', () => (
    <div style={{ width: '400px' }}>
      <Input />
    </div>
  ))
  .add('with placeholder', () => (
    <div style={{ width: '400px' }}>
      <Input
        placeholder="Placeholder example"
      />
    </div>
  ));
