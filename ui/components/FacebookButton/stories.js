import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import FacebookButton from './index';

storiesOf('FacebookButton', module)
  .addDecorator(centered)
  .add('with login label', () => (
    <FacebookButton label={'Login with Facebook'} />
  ))
  .add('with signup label', () => (
    <FacebookButton label={'Signup with Facebook'} />
  ))
  .add('with full width style', () => (
    <FacebookButton
      label={'Login with Facebook'}
      style={{
        width: '100%',
      }}
    />
  ));
