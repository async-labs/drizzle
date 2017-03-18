import moment from 'moment';
import { buildSearchExp } from 'meteor/drizzle:util';

export function buildFilterQuery(params) {
  const { productId } = params;
  const query = {
    productId,
  };

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

    if (params.filter.isUnlockedFreeContent) {
      query.isUnlockedFreeContent = true;
    }

    if (params.filter.isMicropaid) {
      query.isMicropaid = true;
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
        ],
      }]);
    }

    if (params.filter.isUnsubscribed) {
      query.$and = (query.$and || []).concat([{
        $or: [
          { isUnsubscribed: true },
        ],
      }]);
    }
  }

  return query;
}
