import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

export default class ProductMenu extends Component {
  renderItem({ url, sub }) {
    const { currentRoute } = this.props;

    let active = url.path === currentRoute.context.pathname;

    let subMenu = '';
    if (url.subUrls) {
      active = active || url.subUrls.some(s => s.path === currentRoute.context.pathname);

      subMenu = (
        <ul className={classNames('sidebar-submenu', { active })}>
          {url.subUrls.map(subUrl => this.renderItem({ url: subUrl, parent: url, sub: true }))}
        </ul>
      );
    }

    return (
      <li
        key={url.path}
        className={classNames({ sub, active })}
      >
        <a href={url.path} style={{ color: 'white', display: 'block' }}>
          {url.name}
        </a>
        {subMenu}
      </li>
    );
  }

  render() {
    const { urls } = this.props;

    return (
      <div className="sidebar-menu-block">
        <ul className="sidebar-menu">
          {urls.map(url => this.renderItem({ url }))}
        </ul>
      </div>
    );
  }
}

ProductMenu.propTypes = {
  currentRoute: PropTypes.object.isRequired,
  urls: PropTypes.array.isRequired,
};
