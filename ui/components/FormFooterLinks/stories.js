import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import FormFooterLinks from './';

const minProps = {
  links: [{
    href: '/#',
    label: 'Link 1',
  }, {
    href: '/#',
    label: 'Link 2',
  }, {
    href: '/#',
    label: 'Link 3',
  }],
};

storiesOf('FormFooterLinks', module)
  .addDecorator(centered)
  .add('default', () => (
    <FormFooterLinks {...minProps} />
  ));
