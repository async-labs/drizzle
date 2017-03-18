import React, { PropTypes, Component } from 'react';

import { error } from '../../notifier';


export default class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.fields = {};
  }

  onSubmit(e) {
    e.preventDefault();

    const { addProduct } = this.props;

    const data = {
      url: this.refs.url.value.trim(),
      numberVisitors: Number(this.refs.numberVisitors.value.trim()),
    };

    if (!data.url) {
      return error('You must specify URL.');
    }

    if (!data.numberVisitors) {
      return error('You must specify numberVisitors.');
    }

    return addProduct(data);
  }

  render() {
    return (
      <div id="signup" className="row">
        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-10 package">
          <h2 className="page-header text-center">Add new website</h2>
          <form className="signup framed" onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="url"
                className="form-control"
                placeholder="Paste URL of the website"
                ref="url"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="number"
                name="numberVisitors"
                placeholder="Number of unique visitors on your website"
                ref="numberVisitors"
                min={1}
              />
            </div>
            <div className="form-group" id="login1">
              <input type="submit" className="btn btn-default margin-20" value="Add website" />
              <a className="btn btn-default remove redi" href="/websites">Go back</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AddProduct.propTypes = {
  addProduct: PropTypes.func.isRequired,
};
