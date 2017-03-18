import React from 'react';
import { storiesOf } from '@kadira/storybook';

import CardInfo from './index';

const cardData = {
  id: 'card_17rGnZAmHUfQHvldPZyrZ56z',
  brand: 'Visa',
  last4: '8455',
  exp_month: 5,
  exp_year: 2018,
  country: 'US',
  name: null,
};

storiesOf('CardInfo', module)
  .add('default', () => (
    <CardInfo card={cardData} />
  ));
