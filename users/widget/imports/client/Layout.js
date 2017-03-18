import React, { PropTypes, Component } from 'react';
import { composeWithTracker } from 'react-komposer';
import NotificationSystem from 'react-notification-system';

import { getCurrentProduct } from '/imports/products/client/api';

import UserHeader from './UserHeader.jsx';
import AnonHeader from './AnonHeader.jsx';
import Footer from './Footer.jsx';

import AuthContainer from './containers/AuthContainer';

import { Provider } from 'react-redux';
import store from './store';

const styles = {
  hr: {
    marginTop: '10px',
    marginBottom: '0px',
  },
};

let notificationSystemConf;
export function notificationSystem(params) {
  if (notificationSystemConf) {
    notificationSystemConf.addNotification(params);
  }
}

const LoginButtons = React.createClass({
  propTypes: {
    user: PropTypes.object,
  },

  render() {
    const { user } = this.props;
    const name = user && user.profile && user.profile.name || '';
    const headerStyle = {
      textAlign: 'right',
      marginTop: 5,
      marginRight: 10,
    };


    if (user) {
      return (
        <div style={headerStyle}>
          Hi, {name} | <a id="forgot" href="/logout">log out</a>
        </div>
      );
    }

    return (
      <div style={headerStyle}>
        <a href="/login">Log in</a> or <a href="/register">Sign up</a>
      </div>
    );
  },
});

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

class Layout extends Component {
  componentDidMount() {
    notificationSystemConf = this.refs.notificationSystem;
  }

  render() {
    const { content, user } = this.props;

    return (
      <Provider store={store}>
        <main>
          <LoginButtons user={user} />
          <hr style={styles.hr} />
          {user ? <UserHeader /> : <AnonHeader />}
          <div
            className="widget-tabs-content"
            style={{
              backgroundColor: 'white',
              padding: '20px 15px !important',
            }}
          >
            {content}
          </div>
          <Footer />
          <NotificationSystem ref="notificationSystem" style={notStyle} />
        </main>
      </Provider>
    );
  }
}

Layout.propTypes = {
  content: PropTypes.object,
  user: PropTypes.object,
};

function composer(props, onData) {
  const product = getCurrentProduct();

  if (!product) { return; }

  onData(null, { });
}

export default AuthContainer(composeWithTracker(composer)(Layout));
