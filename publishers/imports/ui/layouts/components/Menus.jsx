import React, { PropTypes } from 'react';

export default function Menus({ isLoggingIn, isLoggedIn }) {
  if (isLoggingIn) {
    return <span></span>;
  }

  return (
    <ul className="nav navbar-nav margin-t-10">
      
    </ul>
  );
}

Menus.propTypes = {
  isLoggingIn: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
