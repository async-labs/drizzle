import React, { PropTypes, Component } from 'react';

import { error } from '../../notifier';

export default class MailgunConfig extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      configuration: this.props.configuration,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      configuration: nextProps.configuration,
    });
  }

  onSubmit(event) {
    event.preventDefault();

    const { configMailgun, product } = this.props;
    const { configuration } = this.state;

    const data = {
      domain: configuration.domain,
      apiKey: configuration.apiKey,
      fromName: configuration.fromName,
      fromEmail: configuration.fromEmail,
      productId: product._id,
    };

    if (!data.domain || !data.apiKey) {
      error('Fill list ID and API key');
      return;
    }

    configMailgun(data);
  }

  handleChange(event) {
    const { configuration } = this.state;
    configuration[event.target.name] = event.target.value;

    this.setState({
      configuration,
    });
  }

  render() {
    const { configuration } = this.state;

    return (
      <div>
        <div className="tab-content">
          <h2 className="text-center pad20 gray-title">
            Mailgun Integration
          </h2>

          <form
            onSubmit={this.onSubmit}
          >
            <input
              type="text"
              className="form-control w-300 margin-auto"
              placeholder="Domain"
              value={configuration.domain || ''}
              onChange={this.handleChange}
              name="domain"
              required
            />

            <input
              type="text"
              className="form-control w-300 margin-auto margin-t-20"
              placeholder="API Key"
              value={configuration.apiKey || ''}
              onChange={this.handleChange}
              name="apiKey"
              required
            />

            <input
              type="text"
              className="form-control w-300 margin-auto margin-t-20"
              placeholder="From Name"
              value={configuration.fromName || ''}
              onChange={this.handleChange}
              name="fromName"
              required
            />

            <input
              type="email"
              className="form-control w-300 margin-auto margin-t-20"
              placeholder="From Email"
              value={configuration.fromEmail || ''}
              onChange={this.handleChange}
              name="fromEmail"
              required
            />

            <div className="text-center margin-10">
              <button
                className="btn btn-default"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

MailgunConfig.propTypes = {
  product: PropTypes.object.isRequired,
  configuration: PropTypes.object.isRequired,
  configMailgun: PropTypes.func.isRequired,
};
