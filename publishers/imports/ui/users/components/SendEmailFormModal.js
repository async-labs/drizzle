import React, { PropTypes, Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

class SendEmailFormModal extends Component {
  closeModal() {
    FlowRouter.go('/emails');
  }

  renderConfigMessage() {
    return (
      <p>
        Please configure Mailgun API setting.
        Go to <a
          onClick={this.closeModal}
          data-dismiss="modal"
        >
          Emails
        </a>
      </p>
    );
  }

  renderForm() {
    const { isMailgunConfigured, onSubmit } = this.props;

    if (!isMailgunConfigured) {
      return this.renderConfigMessage();
    }

    return (
      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}>
        <div className="form-group">
          <label htmlFor="emailSubject">Subject</label>
          <input
            type="text"
            className="form-control"
            id="emailSubject"
            placeholder="Subject"
            name="subject"
            required
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
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-default">Send</button>
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="modal-title">Send Email</h4>
        </div>

        <div className="modal-body">
          {::this.renderForm()}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
          >Close</button>
        </div>
      </div>
    );
  }
}

SendEmailFormModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isMailgunConfigured: PropTypes.bool.isRequired,
};

export default SendEmailFormModal;
