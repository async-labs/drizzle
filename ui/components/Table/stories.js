import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import Table from './index';

const minProps = {
  headers: ['Name', 'Email', 'Spent'],
  records: [{
    name: 'Lucas',
    email: 'ln.munhoz@gmail.com',
    spent: '$0.15',
  }, {
    name: 'Tima',
    email: 'tima@getdrizzle.com',
    spent: '$0.25',
  }, {
    name: 'Delgemurun',
    email: 'pdelgemurun@gmail.com',
    spent: '$1.15',
  }],
};

storiesOf('Table', module)
  .addDecorator(story => (
    <div style={{ width: 800 }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <Table {...minProps} />
  ));
