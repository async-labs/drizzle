import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { currentProduct } from '../../products/currentProduct';
import { error, success } from '../../notifier';

import {
  Plans,
  ContentWalls,
  Categories,
} from 'meteor/drizzle:models';

import {
  toggleDisabled,
  toggleAutoDecryption,
  saveContent,
  saveImage,
  saveVimeoVideoUrl,
  saveAutoDecryptionConfig,
  toggleFixedPricing,
  saveFixedPrice,
  toggleVideo,
  toggleLeadGeneration,
  changePlan,
  changeCategory,
} from '../actions';

import ManageContentWall from '../components/ManageContentWall.jsx';

function subscribe({ wallId, productId }) {
  const subs = [
    Meteor.subscribe('contentWalls/getById', wallId).ready(),
    Meteor.subscribe('subscriptions.plansByProductId', { productId }).ready(),
    Meteor.subscribe('contentWalls.categories', productId).ready(),
  ];

  return _.every(subs);
}

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  if (!Meteor.userId()) { return; }

  if (!subscribe({ wallId: props.id, productId: product._id })) {
    return;
  }

  const wall = ContentWalls.findOne(props.id);
  if (!wall || product._id !== wall.productId || !product.isOwner(Meteor.userId())) {
    FlowRouter.go('/');
    return;
  }

  onData(null, {
    wall,
    product,
    toggleDisabled,
    toggleAutoDecryption,
    toggleFixedPricing,
    saveContent,
    saveImage,
    saveVimeoVideoUrl,
    saveAutoDecryptionConfig,
    saveFixedPrice,
    toggleVideo,
    toggleLeadGeneration,
    changePlan,
    changeCategory,
    isVimeoConnected: !!product.vimeoToken && product.vimeoToken.isConnected,
    plans: Plans.find({ productId: product._id }, { sort: { name: 1 } }).fetch(),
    categories: Categories.find({ productId: product._id }, { sort: { name: 1 } }).fetch(),
    updateEmbedlyData() {
      Meteor.call('contentWalls.updateEmbedlyData', wall._id, (err) => {
        if (err) {
          error(err);
        } else {
          success('Updated');
        }
      });
    },
  });
}

export default composeWithTracker(composer)(ManageContentWall);
