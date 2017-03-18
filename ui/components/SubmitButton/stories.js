import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import SubmitButton from './index';

storiesOf('SubmitButton', module)
  .addDecorator(centered)
  .add('with label', () => (
    <SubmitButton
      label="Submit"
    />
  ))
  .add('with label and submiting', () => (
    <SubmitButton
      label="Submit"
      isSubmiting
    />
  ))
  .add('with submiting and submitingLabel', () => (
    <SubmitButton
      label="Submit"
      submitingLabel="Wait..."
      isSubmiting
    />
  ));
