import React, { PropTypes, Component } from 'react';
import { error } from '../../notifier';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.fields = {};
  }

  onSubmit(e) {
    e.preventDefault();

    const { login } = this.props;

    const data = {
      email: this.fields.email.value.trim(),
      password: this.fields.password.value.trim(),
    };

    if (!data.email || !data.password) {
      return error('Please full all fields!');
    }

    return login(data);
  }

  render() {
    return (
      <div id="login" className="login-form">
        <div id="application-login">
          <div className="section">
            <form
              onSubmit={this.onSubmit}
            >
              <div className="title">Log In</div>
              <input
                className="field"
                type="email"
                name="email"
                placeholder="Email"
                ref={node => {
                  this.fields.email = node;
                }}
              />
              <input
                className="field"
                type="password"
                name="password"
                placeholder="Password"
                ref={node => {
                  this.fields.password = node;
                }}
              />
              <div className="extra">
                <label
                  htmlFor="stayLoggedIn"
                  style={{ display: 'none' }}
                >
                  <input
                    className="checkbox"
                    type="checkbox"
                    name="stayLoggedIn"
                    id="stayLoggedIn"
                    ref={node => {
                      this.fields.staySignedIn = node;
                    }}
                  />
                &nbsp;Stay signed in
                </label>
              </div>
              <button
                className="button primary"
                type="submit"
              >
                Log In
              </button>
              <div className="fs13 text-right">
                <a href="/auth/recover-password">Forgot your password?</a>
              </div>
            </form>
          </div>
        </div>
        <div className="extra">
          Don't have an account? <a className="button link" href="/signup">Sign Up</a>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};
