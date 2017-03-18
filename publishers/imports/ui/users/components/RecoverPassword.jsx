import React, { PropTypes, Component } from 'react';

import { error } from '../../notifier';

export default class RecoverPassword extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.fields = {};
  }

  onSubmit(e) {
    e.preventDefault();

    const { recoverPassword } = this.props;

    const data = {
      email: this.fields.email.value.trim(),
    };

    if (!data.email) {
      return error('Please input Email');
    }

    return recoverPassword(data);
  }

  render() {
    const { userId } = this.props;

    if (userId) {
      return <span>You are logged in. Go to <a href="/">homepage</a></span>;
    }

    return (
      <div id="login">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: 20 }}>
          <h2 className="text-center">Recover Password</h2>
          <form id="application-signup" className="login" onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Your Email"
                ref={node => {
                  this.fields.email = node;
                }}
              />
            </div>

            <div className="form-group" id="login1">
              <input type="submit" className="btn btn-default margin-t-0" value="Email link" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

RecoverPassword.propTypes = {
  userId: PropTypes.string,
  recoverPassword: PropTypes.func.isRequired,
};
