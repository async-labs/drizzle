import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import CardForm from './index';
import centered from '@kadira/react-storybook-decorator-centered';

storiesOf('CardForm', module)
  .addDecorator(story => (
    <div style={{ width: 400 }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <CardForm
      onSubmit={action('onSubmit')}
    />
  ));
