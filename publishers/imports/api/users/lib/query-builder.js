import moment from 'moment';
import { Plans } from 'meteor/drizzle:models';
import { buildSearchExp } from 'meteor/drizzle:util';

export function buildFilterQuery(params) {
  const { productId } = params;
  const query = {
    productId,
  };

  const planIds = Plans.find({ productId }, {
    fields: {
      _id: 1,
    },
  }).map(p => p._id);

  if (params.startDate) {
    query.createdAt = {
      $gte: moment(params.startDate, 'MM-DD-YYYY').startOf('day').toDate(),
    };
  }

  if (params.endDate) {
    query.createdAt = {
      $lte: moment(params.endDate, 'MM-DD-YYYY').endOf('day').toDate(),
    };
  }

  if (params.startDate && params.endDate) {
    query.createdAt = {
      $gte: moment(params.startDate, 'MM-DD-YYYY').startOf('day').toDate(),
      $lte: moment(params.endDate, 'MM-DD-YYYY').endOf('day').toDate(),
    };
  }

  if (params.searchQuery) {
    const regExp = buildSearchExp(params.searchQuery);
    query.$and = (query.$and || []).concat([{
      $or: [
        { name: regExp },
        { email: regExp },
      ],
    }]);
  }

  if (params.filter) {
    if (params.filter.isRegisteredAtIt) {
      query.isRegisteredAtIt = true;
    }

    if (params.filter.isReferred) {
      query.isReferred = true;
    }

    if (params.filter.isReferrer) {
      query.isReferrer = true;
    }

    if (params.filter.isUnlockedFreeContent) {
      query.isUnlockedFreeContent = true;
    }

    if (params.filter.isMicropaid) {
      query.isMicropaid = true;
    }

    if (params.filter.isBoughtDailyAccess) {
      query.isBoughtDailyAccess = true;
    }

    if (params.filter.isUsedFreeTrial) {
      query.freeTrialEndAt = { $gt: new Date() };
    }

    if (params.filter.isCancelledFreeTrial) {
      query.isCancelledFreeTrial = true;
    }

    if (params.filter.isSubscribed) {
      query.$and = (query.$and || []).concat([{
        $or: [
          { isSubscribed: true },
          { isWeeklySubscribed: true },
          { subscribedPlanIds: { $in: planIds } },
        ],
      }]);
    }

    if (params.filter.isUnsubscribed) {
      query.$and = (query.$and || []).concat([{
        $or: [
          { isUnsubscribed: true },
          { isWeeklyUnsubscribed: true },
          { unsubscribedPlanIds: { $in: planIds } },
        ],
      }]);
    }
  }

  return query;
}
