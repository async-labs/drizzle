import React, { PropTypes, Component } from 'react';

export default class WelcomeEmail extends Component {
  constructor(props) {
    super(props);

    this.saveConfig = this.saveConfig.bind(this);
  }

  saveConfig(event) {
    event.preventDefault();

    const { product, saveConfig } = this.props;

    const subject = event.target.subject.value;
    const body = event.target.body.value;

    saveConfig({ productId: product._id, subject, body });
  }

  render() {
    const config = this.props.config || {};

    return (
      <div className="row">
        <h2 className="margin-b-20 text-center gray-title">
          Welcome Email to New Users
        </h2>

        <div className="col-md-8 col-md-offset-2">
          <form onSubmit={this.saveConfig}>
            <div className="form-group">
              <label htmlFor="emailSubject">Subject</label>
              <input
                type="text"
                className="form-control"
                id="emailSubject"
                placeholder="Subject"
                name="subject"
                defaultValue={config.subject || ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailContent">Body</label>
              <textarea
                className="form-control"
                id="emailContent"
                placeholder="Body"
                rows="10"
                name="body"
                defaultValue={config.body || ''}
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-default">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

WelcomeEmail.propTypes = {
  config: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  saveConfig: PropTypes.func.isRequired,
};
