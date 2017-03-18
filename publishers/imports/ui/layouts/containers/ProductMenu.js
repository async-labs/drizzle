import { composeWithTracker } from 'react-komposer';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { currentProduct } from '../../products/currentProduct';

import ProductMenu from '../components/ProductMenu.jsx';


const urls = [
  { path: '/', name: 'Content' },
  { path: '/users', name: 'Users' },
  {
    path: '/payout', name: 'Payouts',
    subUrls: [
      { path: '/payout', name: 'Payouts' },
      { path: '/single-payments', name: 'Single payments' },
      { path: '/subscriptions', name: 'Subscriptions' },
      { path: '/payout/monthly-graph', name: 'Payout by month' },
    ],
  },
  {
    path: '/wall-settings', name: 'Settings',
    subUrls: [
      { path: '/wall-settings', name: 'Wall setup' },
      { path: '/subscriptions/config', name: 'Subscriptions' },
      { path: '/custom-logo', name: 'Custom Logo' },
      { path: '/emails', name: 'Emails' },
      { path: '/setup', name: 'Setup' },
      { path: '/websites', name: 'Websites' },
    ],
  },
];

function composer(props, onData) {
  const product = currentProduct();
  if (!product) {
    return;
  }

  const currentRoute = FlowRouter.current();
  onData(null, {
    currentRoute,
    urls,
  });
}

export default composeWithTracker(composer)(ProductMenu);
