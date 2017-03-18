import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ReactiveVar } from 'meteor/reactive-var';
import { buildSearchExp } from 'meteor/drizzle:util';
import { ContentWalls, Categories } from 'meteor/drizzle:models';

import { currentProduct } from '../../products/currentProduct';

import WallList from '../components/WallList';

const offsetVar = new ReactiveVar(0);
const searchVar = new ReactiveVar('');
const sortingVar = new ReactiveVar({});

const DUMMY_WALL = {
  _id: '5bLpzi9WNfNrMf9hK',
  autoDecryption: false,
  createdAt: new Date('Thu Nov 10 2016 19:28:23 GMT+0800 (ULAT)'),
  disabled: false,
  isActive: true,
  isEncryptedContentIntalled: true,
  price: 25,
  sellCount: 123,
  title: 'Example',
  totalIncome: 1300,
  url: 'example.com/',
  viewCount: 1200,
  cpm: 0.12,
  freeTrialSubscribedUserCount: 2,
  popularity: 5,
  registeredUserCount: 2,
  subscribedUserCount: 6,
  uniqueViewCount: 7,
};

function changeSorting(key) {
  const sorting = sortingVar.get();

  if (sorting[key] === -1) {
    sortingVar.set({ [key]: 1 });
  } else {
    sortingVar.set({ [key]: -1 });
  }
}


function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return null; }

  const limit = 20;
  const sorting = sortingVar.get();
  const offset = offsetVar.get();

  const params = {
    limit,
    offset,
    productId: product._id,
    search: searchVar.get(),
    categoryId: props.categoryId,
    sorting,
  };

  if (!Meteor.subscribe('contentWalls/listByProduct', params).ready()) {
    return null;
  }

  if (!Meteor.subscribe('contentWalls.categories', product._id).ready()) {
    return null;
  }

  const filter = { productId: product._id };

  if (params.categoryId) {
    filter.categoryIds = params.categoryId;
  }

  if (params.search) {
    const regExp = buildSearchExp(params.search);
    filter.$or = [
      { url: regExp },
      { title: regExp },
    ];
  }

  const sort = _.isEmpty(sorting) ? { createdAt: -1 } : sorting;

  const walls = ContentWalls.find(
    filter,
    { sort, limit }
  ).fetch();

  if (!product.isSetupDone() && walls.length === 0 && offset === 0) {
    walls.push(_.extend({ productId: product._id }, DUMMY_WALL));
  }

  onData(null, {
    product,
    limit,
    walls,
    totalCount: props.totalCount,
    search(q) {
      offsetVar.set(0);
      searchVar.set(q);
    },
    offset,
    changeOffset(val) {
      offsetVar.set(val);
    },
    categories: Categories.find({ productId: product._id }, { sort: { name: 1 } }).fetch(),
    categoryId: props.categoryId,

    sorting,
    changeSorting,
  });

  return () => {
    offsetVar.set(0);
    searchVar.set('');
    sortingVar.set({});
  };
}

export default composeWithTracker(composer)(WallList);
