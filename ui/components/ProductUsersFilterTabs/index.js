import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './style.scss';

const ProductUsersFilterTabs = ({ tabs, isLoading, style }) => (
  <div
    className="tabs"
    style={style}
  >
    {tabs.map((tab, index) => (
      <div
        key={`${index}`}
        onClick={tab.onClick}
        className={classNames(
          'tab',
          tab.isActive && 'active'
        )}
      >
        {tab.label}&nbsp;{isLoading ? (
          <i className="fa fa-spinner fa-pulse fa-fw" style={{ display: 'inline-block' }}></i>
        ) : (
          <span> ({tab.count}) </span>
        )}
      </div>
    ))}
  </div>
);

ProductUsersFilterTabs.propTypes = {
  style: PropTypes.object,
  isLoading: PropTypes.bool,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      onClick: PropTypes.func.isRequired,
      isActive: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default ProductUsersFilterTabs;


/* <div className="tab active">All (10) </div>
<div className="tab">Registered Only (10) </div>
<div className="tab">Trial (10) </div>
<div className="tab">Cancelled Trial (10) </div>
<div className="tab">Paid for Content (10) </div>
<div className="tab">Subscribed (10) </div>
<div className="tab">Cancelled Subscription (10) </div> */
