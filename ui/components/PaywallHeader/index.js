import React, { PropTypes } from 'react';

import Toggle from '../Toggle';


const styles = {
  root: {
    display: 'flex',
    padding: '20px',
    transition: 'all 0.3s ease',
    borderRadius: '7px',
  },
  titleContainer: {
    flex: 2,
    fontSize: '1.4em',
  },
  toogleContainer: {
    flex: 1,
    textAlign: 'right',
  },
};

const PaywallHeader = ({ title, url, enabled, onEnableToggle, style }) => {
  const mergedStyles = Object.assign({}, styles.root, style);

  if (enabled) {
    mergedStyles.backgroundColor = 'rgba(0, 203, 33, 0.32)';
  } else {
    mergedStyles.backgroundColor = 'rgba(161,161,161,0.30)';
  }

  const label = enabled ? 'Enabled' : 'Disabled';

  return (
    <div style={mergedStyles}>
      <div style={styles.titleContainer}>
        {title} &nbsp;
        <a href={url}>
          <i className="fa fa-external-link"></i>
        </a>
      </div>
      <div style={styles.toogleContainer}>
        <label> {label}&nbsp; </label>
        <Toggle
          toggled={enabled}
          onToggle={onEnableToggle}
        />
      </div>

    </div>
  );
};

PaywallHeader.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onEnableToggle: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default PaywallHeader;
