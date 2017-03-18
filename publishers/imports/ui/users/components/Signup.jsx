import React, { PropTypes, Component } from 'react';

import { error } from '../../notifier';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.fields = {};
  }

  onSubmit(e) {
    e.preventDefault();

    const { signup } = this.props;
    const data = {
      url: this.refs.url.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      terms: this.refs.terms.checked,
    };

    if (!data.url || !data.email || !data.password) {
      return error('All fields are required.');
    }

    if (!data.terms) {
      return error('Please accept our Terms of Service.');
    }

    if (data.password.length < 8) {
      return error('Minimal password length is 8!');
    }

    return signup(data);
  }

  render() {
    return (
      <div id="signup" className="signup-form">
        <div id="application-signup">
          <div className="section">
            <form className="text-center" onSubmit={this.onSubmit}>
              <div className="title">Sign up and get more paying users!</div>
              <input
                className="field"
                type="url"
                name="url"
                placeholder="Your website (http://example.com)"
                ref="url"
              />
              <input
                className="field"
                type="email"
                name="email"
                placeholder="Your Email"
                ref="email"
              />
              <input
                className="field"
                type="password"
                name="password"
                placeholder="Your Password (at least 8 characters)"
                ref="password"
              />
              <label htmlFor="terms">
                <input
                  className="checkbox"
                  type="checkbox"
                  name="terms"
                  id="terms"
                  ref="terms"
                />
                I agree to&nbsp;<a href="https://getdrizzle.com/terms" target="_blank">Terms and Privacy Policy</a>
              </label>
              <hr />
              <button
                className="button primary"
                type="submit"
              >
                Create Free Account
              </button>
              <div className="extra">
                By clicking this button, you agree to our <a href="https://getdrizzle.com/terms" target="_blank" style={{ display: 'inline-block' }}>Terms and Privacy Policy</a>.
              </div>
            </form>
          </div>
        </div>
        <div className="extra">
          Already have an account? <a className="button link" href="/login">Log in</a>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
};
