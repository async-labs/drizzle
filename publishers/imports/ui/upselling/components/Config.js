import React, { PropTypes } from 'react';

import {
  ConfigurationToggle,
  ConfigurationBox,
  ConfigurationInput,
 } from '/imports/ui/components';

const styles = {
  toggleName: {
    fontWeight: 300,
  },
};

const UpsellingConfig = ({
  onToggle,
  onChangeUpsellingCount,
  onChangePurchasedCount,
  onChangeUpvoteCount,
  onChangeUserCount,
  upsellingConfig,
}) => (
  <ConfigurationBox
    title="Upselling Content"
    collapsed
  >
    <ConfigurationToggle
      name="Popular Content"
      inputName="popular"
      onToggle={toggled => onToggle({ toggled, type: 'popular' })}
      toggled={upsellingConfig.popular}
      nameStyle={styles.toggleName}
    />

    <ConfigurationToggle
      name="Trending Content"
      onToggle={toggled => onToggle({ toggled, type: 'trending' })}
      toggled={upsellingConfig.trending}
      nameStyle={styles.toggleName}
    />

    <ConfigurationToggle
      name="Similar Content"
      onToggle={toggled => onToggle({ toggled, type: 'related' })}
      toggled={upsellingConfig.related}
      nameStyle={styles.toggleName}

    />

    <ConfigurationToggle
      name="Newest Content"
      onToggle={toggled => onToggle({ toggled, type: 'newest' })}
      toggled={upsellingConfig.newest}
      nameStyle={styles.toggleName}
      nameStyle={{ fontWeight: 300 }}
    />

    <ConfigurationInput
      name="Select number of URL on each Upselling list"
      inputName={'upsellingCount'}
      isForm={false}
      value={upsellingConfig.itemCountToShow}
      onChange={event => {
        onChangeUpsellingCount(event.target.value);
      }}
      options={[
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]}
    />

    <ConfigurationInput
      name="Purchased count threshold (for Treding & Popular)"
      inputName={'purchasedCount'}
      isForm={false}
      value={upsellingConfig.purchasedCount}
      onChange={event => {
        onChangePurchasedCount(event.target.value);
      }}
    />

    <ConfigurationInput
      name="Upvote count threshold (for Treding & Popular)"
      inputName={'upvoteCount'}
      isForm={false}
      value={upsellingConfig.upvoteCount}
      onChange={event => {
        onChangeUpvoteCount(event.target.value);
      }}
    />

    <ConfigurationInput
      name="User count threshold (for Similar)"
      inputName={'userCount'}
      isForm={false}
      value={upsellingConfig.userCount}
      onChange={event => {
        onChangeUserCount(event.target.value);
      }}
    />

  </ConfigurationBox>
);

UpsellingConfig.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onChangeUpsellingCount: PropTypes.func.isRequired,
  onChangePurchasedCount: PropTypes.func.isRequired,
  onChangeUpvoteCount: PropTypes.func.isRequired,
  onChangeUserCount: PropTypes.func.isRequired,
  upsellingConfig: PropTypes.object,
};

UpsellingConfig.defaultProps = {
  upsellingConfig: {},
};

export default UpsellingConfig;
