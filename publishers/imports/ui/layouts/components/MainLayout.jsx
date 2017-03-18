import NProgress from 'nprogress';
import React, { PropTypes, Component } from 'react';
import NotificationSystem from 'react-notification-system';

import Menus from '../containers/Menus';
import ProductMenu from '../containers/ProductMenu.js';
import PublicMenu from '../containers/PublicMenu.js';
import NavbarTop from './NavbarTop.jsx';

NProgress.configure({
  easing: 'ease',
  speed: 3000,
  showSpinner: false,
});

let notificationSystemConf;
export function notificationSystem(params) {
  if (notificationSystemConf) {
    notificationSystemConf.addNotification(params);
  }
}

const notStyle = {
  Containers: { // Override the notification item
    DefaultStyle: { // Applied to every notification, regardless of the notification level
      width: 280,
    },
    success: { // Applied only to the success notification item
      color: '#8FE099',
    },
  },
};

export default class MainLayout extends Component {
  getChildContext() {
    return {
      currentUser: this.props.currentUser,
    };
  }

  componentDidMount() {
    notificationSystemConf = this.refs.notificationSystem;

    NProgress.start();
    NProgress.set(0.3);

    const { isLoggingIn, isLoading } = this.props;
    if (isLoggingIn || isLoading) {
      NProgress.set(0.5);
      NProgress.set(0.7);
    } else {
      NProgress.done();
    }
  }

  componentDidUpdate() {
    const { isLoggingIn, isLoading } = this.props;
    if (isLoggingIn || isLoading) {
      NProgress.set(0.5);
      NProgress.set(0.7);
    } else {
      NProgress.done();
    }
  }

  render() {
    const { content, isLoggedIn, isLoading, products, userMail, currentProduct } = this.props;
    let main;

    if (isLoading) {
      main = (
        <div className="loader"></div>
      );
    } else {
      main = (
        <div className="margin-t-20 margin-b-30" id="product-item">
          {currentProduct && currentProduct.disabled ?
            <div
              style={{
                textAlign: 'center',
                padding: '5px 0 20px 0',
                color: 'red',
                fontSize: '18px',
              }}
            >
              Hi there, we tried to reach you via email but haven't heard back.
              Our paywall service is no longer available.
              If you want to export your users, contact us at support@getdrizzle.com
            </div>
           : null}
          {content}
        </div>
      );
    }


    return (
      <div className="root clearfix">

        <NavbarTop
          isLoggedIn={isLoggedIn}
          isLoading={isLoading}
          userMail={userMail}
          products={products}
        />

        <aside className="sidebar">
          <nav
            className="navbar navbar-fixed-top"
            role="navigation"
            style={{ height: '100%', overflow: 'scroll' }}
          >
            {isLoggedIn ? (
              <ProductMenu />
            ) : (
              <PublicMenu />
              )
            }

            <div className="sidebar-footer">
              <Menus />
            </div>

          </nav>
        </aside>

        <div className="content">
          {main}
        </div>

        <div className="scroll-top-wrapper">
          <span className="scroll-top-inner">
            <i className="fa fa-chevron-up fa-1x"></i>
          </span>
        </div>
        <NotificationSystem ref="notificationSystem" style={notStyle} allowHTML />
      </div>
    );
  }
}

MainLayout.propTypes = {
  content: PropTypes.element,
  isLoggedIn: PropTypes.bool.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  userMail: React.PropTypes.string,
  currentUser: React.PropTypes.object,
  currentProduct: React.PropTypes.object,
};

MainLayout.childContextTypes = {
  currentUser: React.PropTypes.object,
};
