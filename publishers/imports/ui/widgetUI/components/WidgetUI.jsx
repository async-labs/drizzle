import React, { PropTypes, Component } from 'react';

import { error } from '/imports/ui/notifier';


export default class WidgetUI extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      selectedFileName: null,
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const { product, saveImage } = this.props;
    const config = product.widgetUI || {};

    const data = {};

    const files = document.getElementById('image-file').files;
    if (files && files.length > 0) {
      saveImage({ file: files[0] }, (err, url) => {
        if (err) {
          error(err.reason || err.message || err);
        } else {
          document.getElementById('image-file').value = '';
          data.image = url;

          this.saveConfig(data);
        }
      });
    } else {
      data.image = config.image || '';
      this.saveConfig(data);
    }
  }

  onChange(event) {
    this.setState({ selectedFileName: event.target.files[0].name });
  }

  saveConfig(data) {
    const { product, saveConfig } = this.props;

    saveConfig({ productId: product._id, data });
  }

  render() {
    const { product, image } = this.props;

    if (!product) {
      return <span></span>;
    }

    return (
      <div className="tab-content package1">
        <div className="clearfix margin-t-20 customize-look">
          <h2 className="customize-look-title gray-title text-center">
            Add custom logo
          </h2>

          <div className="customize-look-form margin-t-20">
            <form className="text-center" onSubmit={this.onSubmit}>
              <img src={image} alt="Custom logo" className="margin-20" />
              <div style={{ backgroundColor: '#f9f9f9', padding: '10px' }}>
                <div>{this.state.selectedFileName}</div>
                <label htmlFor="image-file" className="file-upload-button">
                  <span>Upload logo</span>
                  <input type="file" id="image-file" accept="image/*" onChange={this.onChange} />
                </label>
                <div className="file-upload-placeholder">Your logo must be 300x120 pixels.</div>
              </div>
              <div className="text-center margin-10">
                <button className="btn btn-primary" type="submit">Save</button>
              </div>
            </form>
          </div>

          <div className="customize-look-example">
            <div style={{ position: 'relative', width: '350px' }}>
              <img
                alt="Widget UI"
                src="https://s3-us-west-1.amazonaws.com/zenmarket/logo.png"
                style={{ width: '350px', height: '600px' }}
              />

              {image ?
                <img
                  src={image}
                  alt="Custom logo"
                  className="customize-look-example-logo"
                />
                : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WidgetUI.propTypes = {
  product: PropTypes.object.isRequired,
  saveConfig: PropTypes.func.isRequired,
  saveImage: PropTypes.func.isRequired,
  image: PropTypes.string,
};
