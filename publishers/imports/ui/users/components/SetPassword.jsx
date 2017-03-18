import React, { PropTypes, Component } from 'react';

import { error } from '../../notifier';

export default class SetPassword extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.fields = {};
  }

  onSubmit(e) {
    e.preventDefault();

    const { setPassword, token } = this.props;

    const data = {
      password: this.fields.password.value.trim(),
      token,
    };

    if (!data.password) {
      return error('Please input Password');
    }

    return setPassword(data);
  }

  render() {
    const { userId } = this.props;

    if (userId) {
      return <span>You are logged in. Go to <a href="/">homepage</a></span>;
    }

    return (
      <div id="login">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: 20 }}>
          <h2 className="text-center">Set New Password</h2>
          <form id="application-reset" className="login" onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="New Password"
                ref={node => {
                  this.fields.password = node;
                }}
              />
            </div>

            <div className="form-group" id="login1">
              <input type="submit" className="btn btn-default" value="Update password" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

SetPassword.propTypes = {
  userId: PropTypes.string,
  token: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
};
