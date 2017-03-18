import React, { PropTypes } from 'react';

const WidgetTabs = ({ style, tabs }) => (
  <nav style={style}>
    <ul className="main-menu">
      {
        tabs.map((tab, index) => (
          <li
            key={index}
            className={tab.isActive ? 'active' : ''}
          >
            <a href={tab.path}>
              <i
                className={`fa ${tab.faIcon}`}
                aria-hidden="true"
              />
              <span> {tab.label} </span>
            </a>
          </li>
          )
        )
      }
    </ul>
  </nav>
);

WidgetTabs.propTypes = {
  style: PropTypes.object,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      faIcon: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
    })
  ),
};

export default WidgetTabs;
