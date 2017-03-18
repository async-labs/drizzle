import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';

import ProductUsersFilterTabs from '/imports/ui/components/ProductUsersFilterTabs';

const isFilterActive = (filter) =>
  FlowRouter.getQueryParam('filter') === filter;

const createTab = (label, filter) => ({
  label,
  isActive: isFilterActive(filter),
  count: filter
    ? Counts.get(`productUsers.counters.${filter}`)
    : Counts.get('productUsers.counters.all'),
  onClick: () => (filter
    ? FlowRouter.setQueryParams({ filter, offset: 0 })
    : FlowRouter.setQueryParams({ filter: null, offset: 0 })
  ),
});

function compose(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  const params = {
    startDate: FlowRouter.getQueryParam('fromDate'),
    endDate: FlowRouter.getQueryParam('toDate'),
    searchQuery: FlowRouter.getQueryParam('search'),
    productId: product._id,
  };

  const subscription = Meteor.subscribe('productUsers.counters', params);

  return onData(null, {
    isLoading: !subscription.ready(),
    tabs: [
      createTab('All', null),
      createTab('Registered', 'isRegisteredAtIt'),
      createTab('Single Payment', 'isMicropaid'),
      createTab('Trial', 'isUsedFreeTrial'),
      createTab('Cancelled Trial', 'isCancelledFreeTrial'),
      createTab('Subscribed', 'isSubscribed'),
      createTab('Unsubscribed', 'isUnsubscribed'),
    ],
  });
}

export default composeWithTracker(compose)(ProductUsersFilterTabs);
