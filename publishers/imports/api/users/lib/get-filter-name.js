export function getFilterName(params) {
  let name = 'All';

  if (params.startDate || params.endDate) {
    name = 'Date Filtered';
  }

  if (params.searchQuery) {
    name = 'Searched';
  }

  if (params.filter) {
    if (params.filter.isRegisteredAtIt) {
      name = 'Registered';
    }

    if (params.filter.isReferred) {
      name = 'Referred';
    }

    if (params.filter.isReferrer) {
      name = 'Referrer';
    }

    if (params.filter.isUnlockedFreeContent) {
      name = 'Unlocked Free Content';
    }

    if (params.filter.isMicropaid) {
      name = 'Single Payment';
    }

    if (params.filter.isBoughtDailyAccess) {
      name = 'Daily Pass';
    }

    if (params.filter.isUsedFreeTrial) {
      name = 'Trial';
    }

    if (params.filter.isCancelledFreeTrial) {
      name = 'Cancelled Trial';
    }

    if (params.filter.isSubscribed) {
      name = 'Subscribed';
    }

    if (params.filter.isUnsubscribed) {
      name = 'Unsubscribed';
    }
  }

  return name;
}
