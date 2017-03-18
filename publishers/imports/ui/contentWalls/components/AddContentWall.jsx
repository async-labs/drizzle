import React, { PropTypes, Component } from 'react';

import { error } from '../../notifier';

export default class AddContentWall extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.fields = {};
  }

  onSubmit(e) {
    e.preventDefault();

    const { product, addWall } = this.props;

    const data = {
      url: this.fields.url.value.trim(),
      productId: product._id,
    };

    if (!data.url) {
      return error('You must specify URL.');
    }

    return addWall(data);
  }

  render() {
    return (
      <div id="signup" className="row">
        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-10 package">
          <h2 className="page-header text-center">Add new content</h2>
          <form className="signup framed" onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="url"
                className="form-control"
                placeholder="Paste URL of the webpage"
                ref={node => {
                  this.fields.url = node;
                }}
              />
            </div>
            <div className="form-group" id="login1">
              <input type="submit" className="btn btn-default" value="Create new paywall" />
              <a className="btn btn-default remove margin-20 redi" href="/">Go back</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}


AddContentWall.propTypes = {
  addWall: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};
