import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import RegisterForm from './index';

storiesOf('RegisterForm', module)
  .addDecorator((story) => (
    <div style={{ width: '400px' }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <RegisterForm
      onSubmit={action('onSubmit')}
      onFacebookClick={action('onFacebookClick')}
    />
  ))
  .add('with isSigningIn enabled', () => (
    <RegisterForm
      onSubmit={action('onSubmit')}
      onFacebookClick={action('onFacebookClick')}
      isSigningIn
    />
  ));
