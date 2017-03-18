import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import LoginForm from './index';
import centered from '@kadira/react-storybook-decorator-centered';

storiesOf('LoginForm', module)
  .addDecorator((story) => (
    <div style={{ width: '400px' }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <LoginForm
      onSubmit={action('onSubmit')}
      onFacebookClick={action('onFacebookClick')}
    />
  ))
  .add('with isLoggingIn enabled', () => (
    <LoginForm
      onSubmit={action('onSubmit')}
      onFacebookClick={action('onFacebookClick')}
      isLoggingIn
    />
  ));
