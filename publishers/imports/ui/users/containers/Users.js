import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Meteor } from 'meteor/meteor';

import { buildFilterQuery } from '/imports/api/users/lib/query-builder';
import { currentProduct } from '../../products/currentProduct';
import { ProductUsers } from 'meteor/drizzle:models';

import Users from '../components/Users';
import { success, error } from '/imports/ui/notifier';

const DUMMY_USER = {
  _id: 'zBc3PeuowQTFkTemW',
  createdAt: new Date('Fri Nov 18 2016 18:29:00'),
  email: 'demo@example.com',
  firstName: 'Demo',
  freeQuotaTrackingDate: 201610,
  freeReadArticleCount: 0,
  freeTrialBeginAt: new Date('Sat Nov 19 2016 11:49:45'),
  freeTrialEndAt: new Date('Sat Nov 19 2016 11:49:50'),
  isMicropaid: false,
  isRegisteredAtIt: true,
  isSubscribed: true,
  isUnlockedFreeContent: false,
  isUnsubscribed: true,
  lastName: 'User',
  name: 'Demo User',
  productDomain: 'localhost:8060',
  productId: 'phMTk7ZH8aLt6CM9y',
  productTitle: 'Example',
  registeredAt: 'http://localhost:8060/',
  totalSpent: 1200,
  totalUnlockedCount: 2,
  userId: '5JN5n37iFtwmkRDi6',
  user() {
    return {
      isEmailVerified: () => false,
    };
  },
  getFullName() {
    return 'Demo User';
  },
};

let prevClicked = false;
function changeOffset(val) {
  const prevOffset = Number(FlowRouter.getQueryParam('offset')) || 0;
  prevClicked = val < prevOffset;

  FlowRouter.setQueryParams({ offset: val });
}

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return;
  }

  const limit = 20;
  const offset = props.offset;

  const params = {
    limit,
    offset,
    productId: product._id,
    searchQuery: props.searchQuery,
    startDate: props.fromDate,
    endDate: props.toDate,
    filter: props.filter && {
      [props.filter]: true,
    },
  };

  const ready = Meteor.subscribe('productUsers.listByProduct', params).ready();

  Meteor.subscribe('productUsers.counters', params);

  const query = buildFilterQuery(params);
  let productUsers = [];
  if (ready) {
    let skip = 0;
    if (!prevClicked && limit < ProductUsers.find(query).count()) {
      skip = ProductUsers.find(query).count() - limit;
      skip = offset < skip ? offset : skip;
    }

    productUsers = ProductUsers.find(query, { sort: { createdAt: -1 }, limit, skip }).fetch();
  }

  if (!product.isSetupDone() && productUsers.length === 0 && props.offset === 0) {
    productUsers.push(DUMMY_USER);
  }

  onData(null, {
    product,
    productUsers,
    offset,
    limit,
    changeOffset,
    ready,
    totalCount: Counts.get('productUsers.listByProduct.count'),
    handleSendEmailToUsers: (event) => {
      event.preventDefault();
      const { body, subject } = event.target;

      Meteor.call('productUsers.sendEmailToUsers', {
        params,
        body: body.value,
        subject: subject.value,
      }, (err) => {
        if (err) {
          return error(err);
        }

        body.value = '';
        subject.value = '';
        return success('Emails sent!');
      });
    },
    handleSendEmailToUser: ({ productId, productUserId, subject, body }) => {
      Meteor.call('productUsers.sendEmailToUser', {
        productId,
        productUserId,
        body,
        subject,
      }, (err) => {
        if (err) {
          return error(err);
        }

        return success('Email sent!');
      });
    },
  });
}

export default composeWithTracker(composer)(Users);
