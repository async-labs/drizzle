import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import ProductUsersFilterTabs from './index';

const minProps = {
  tabs: [{
    label: 'All',
    count: 10,
    isActive: true,
    onClick: action('onClick'),
  },
    {
      label: 'Registered',
      count: 20,
      onClick: action('onClick'),
    },
    {
      label: 'Subscribed',
      count: 20,
      onClick: action('onClick'),
    }],
};

storiesOf('ProductUsersFilterTabs', module)
  .addDecorator(centered)
  .add('default', () => (
    <ProductUsersFilterTabs
      {...minProps}
    />
  ))
  .add('loading', () => (
    <ProductUsersFilterTabs
      {...minProps}
      isLoading
    />
  ));
