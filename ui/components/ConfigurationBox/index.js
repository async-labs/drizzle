import React, { PropTypes } from 'react';

const styles = {
  root: {
    backgroundColor: '#f9f9f9',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '1px 1px 3px 0px rgba(0, 0, 0, 0.1)',
    padding: 8,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginTop: 10,
    fontWeight: 700,
    flex: 1,
    paddingLeft: 8,
  },
  children: {
    marginTop: 10,
    padding: 8,
  },
};

const ConfigurationBox = ({ title, titleStyle, subtitle, elementRight, collapsed, children }) => (
  <div style={styles.root}>
    <div style={styles.container}>
      <h4
        style={{
          ...styles.title,
          ...titleStyle,
        }}
      >{title} {subtitle && React.cloneElement(subtitle, {
        style: { fontSize: 14 },
      })}
      </h4>

      {elementRight}
    </div>

    {collapsed && children && (
      <div style={styles.children}>
        {children}
      </div>
    )}
  </div>
);

ConfigurationBox.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  collapsed: PropTypes.bool,
  elementRight: PropTypes.node,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
};

export default ConfigurationBox;
