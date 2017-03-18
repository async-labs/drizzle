import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default function PublicMenu({
  setMenu,
  path,
}) {
  const uri = [
    { uri: '/login', name: 'Login', class: '' },
    { uri: '/signup', name: 'Signup', class: '' },
  ];

  return (
    <div className="sidebar-menu-block">

      <ul className="sidebar-menu" onClick={setMenu}>
        <li><a href="https://getdrizzle.com" className="white-text" target="_blank">Go to homepage</a></li>
          {uri.map((v, k) =>
            <li key={k} className={classNames(v.class,
                { active: v.uri === path }
              )}>
            <a
              href={v.uri}>
              {v.name}
            </a>
            </li>
          )}
      </ul>

    </div>
  );
}

PublicMenu.propTypes = {
  path: PropTypes.string.isRequired,
  setMenu: PropTypes.func.isRequired,
};
