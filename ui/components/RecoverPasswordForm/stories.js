import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import RecoverPasswordForm from './index';

storiesOf('RecoverPasswordForm', module)
  .addDecorator((story) => (
    <div style={{ width: '400px' }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <RecoverPasswordForm
      handleError={action('handleError')}
    />
  ));
