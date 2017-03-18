import React, { PropTypes, Component } from 'react';
import moment from 'moment';

import { ConfigurationInput, ConfigurationToggle } from '/imports/ui/components';

import CopyButton from '../../common/copyButton/components/CopyButton.jsx';
import Toggle from 'react-toggle';
import { error } from '../../notifier';

import ToggleAutoDecryption from '../containers/ToggleAutoDecryption';
import ToggleMicropayment from '../containers/ToggleMicropayment';
import ToggleUpselling from '../containers/ToggleUpselling';
import ToggleExpiration from '../containers/ToggleExpiration';
import ConfigGuestButtonText from '../containers/ConfigGuestButtonText';
import ToggleViewportConfig from '../containers/ToggleViewportConfig';

export default class ManageContentWall extends Component {
  constructor(props) {
    super(props);

    this.toggleDisabled = this.toggleDisabled.bind(this);
    this.toggleAutoDecryption = this.toggleAutoDecryption.bind(this);
    this.toggleFixedPricing = this.toggleFixedPricing.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.saveContent = this.saveContent.bind(this);
    this.saveAutoDecryptionConfig = this.saveAutoDecryptionConfig.bind(this);
    this.savePrice = this.savePrice.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.fileChanged = this.fileChanged.bind(this);
    this.changeCategory = this.changeCategory.bind(this);

    this.state = {
      fileInfo: '',
    };
  }

  toggleDisabled(event) {
    const state = !event.target.checked;
    const { wall, toggleDisabled } = this.props;

    toggleDisabled({ id: wall._id, state });
  }

  toggleAutoDecryption(event) {
    const state = event.target.checked;
    const { wall, toggleAutoDecryption } = this.props;

    toggleAutoDecryption({ id: wall._id, state });
  }

  // toggleFixedPricing(event) {
  toggleFixedPricing(toggled) {
    const { wall, toggleFixedPricing } = this.props;

    toggleFixedPricing({
      id: wall._id,
      state: toggled,
    });
  }

  toggleVideo(toggled) {
    const { wall, toggleVideo } = this.props;

    toggleVideo({ id: wall._id, state: toggled });
  }

  saveImage(event) {
    event.preventDefault();

    const { wall, saveImage } = this.props;
    const { isVideo } = wall;

    if (!isVideo) {
      return;
    }

    const files = this.thumbnailNode.files;
    if (files && files.length > 0) {
      saveImage({
        id: wall._id,
        file: files[0],
      }, (err) => {
        if (!err) {
          this.thumbnailNode.value = '';
          this.setState({
            fileInfo: '',
          });
        }
      });
    } else {
      error('Select placeholder image for your video paywall');
    }
  }

  fileChanged(event) {
    const files = event.target.files;
    if (files.length > 0) {
      this.setState({
        fileInfo: `Name: ${files[0].name}, Size: ${Math.round(files[0].size / 1024)}KB`,
      });
    }
  }

  saveContent(event) {
    event.preventDefault();

    const { wall, saveContent } = this.props;

    const original = this.originalNode.value.trim();
    if (!original) {
      error('Specify content');
      return;
    }

    saveContent({ id: wall._id, content: original });
  }

  saveAutoDecryptionConfig(event) {
    event.preventDefault();
    const { wall, saveAutoDecryptionConfig } = this.props;

    const viewCountLimit = Number(this.viewCountLimitNode.value);
    const cpm = Number(this.cpmNode.value);

    return saveAutoDecryptionConfig({ id: wall._id, viewCountLimit, cpm });
  }

  // savePrice(event) {
  savePrice(price) {
    const { wall, saveFixedPrice } = this.props;

    // const price = Number(this.refs.price.value) * 100;
    const priceFixed = Number(price) * 100;

    return saveFixedPrice({
      id: wall._id,
      price: priceFixed,
    });
  }

  changeCategory(event) {
    const id = event.target.value;
    const { wall, changeCategory } = this.props;

    const categoryIds = [];
    if (id) {
      categoryIds.push(id);
    }
    changeCategory({ wallId: wall._id, categoryIds });
  }

  autoCpm(wall) {
    if (!wall.autoDecryptionConfig || !wall.autoDecryptionConfig.cpm) {
      return 'not set';
    }

    return `$${wall.autoDecryptionConfig.cpm}`;
  }

  renderPricing() {
    const { wall } = this.props;

    return (
      <ConfigurationToggle
        name="Pricing"
        helpElement={(
          <span>
            Learn more about our &nbsp;
            <a
              target="blank"
              href="http://publishers.getdrizzle.com/article/21-how-is-the-price-per-piece-of-content-determined"
            >
              dynamic pricing
            </a>
          </span>
        )}
        toggled={wall.fixedPricing}
        onToggle={this.toggleFixedPricing}
        labelLeft={'Dynamic'}
        labelRight={'Fixed'}
      >
        <ConfigurationInput
          name="Specify price: ($0.25-$10.00)"
          value={wall.price / 100}
          onSubmit={this.savePrice}
        />
      </ConfigurationToggle>
    );
  }

  renderContentFrom() {
    const { wall, product } = this.props;
    const content = wall.content || {};

    if (product.usingWordpress) {
      return null;
    }

    return (
      <form onSubmit={this.saveContent}>
        <div>
          <h4>
            Paste the text or html code <b>you want to paywall (hide)</b>.
          </h4>

          <textarea
            rows="14"
            id="embed-code"
            defaultValue={content.original || ''}
            ref={node => {
              this.originalNode = node;
            }}
          ></textarea>
        </div>
        <div className="text-center">
          <button className="btn btn-primary margin-t-20" type="submit">
            Save
          </button>
        </div>
      </form>
    );
  }

  renderEmbedCode() {
    const { wall } = this.props;
    const content = wall.content || {};

    const embedCode = `<div id="zenmarket--wrapper" style="display: none;">
    </div>`;

    if (!content.original) {
      return '';
    }

    return (
      <div>
        <h4><b>Copy-paste</b> embed code below onto your webpage:</h4>
        <textarea
          rows="16"
          className="w98"
          id="encryptedContent"
          value={embedCode}
          readOnly
        ></textarea>
        <div className="text-center">
          <CopyButton target="#encryptedContent" />
        </div>
      </div>
    );
  }

  renderForm() {
    const { wall, product } = this.props;
    const styles = {
      col: {
        marginTop: 20,
        padding: 0,
      },
      row: {
        padding: '20px 0px',
      },

    };

    return (
      <div>
        <div className="row" style={styles.row}>
          <div className="col-md-12" style={{ padding: 0 }}>
            <ToggleMicropayment wall={wall} />
          </div>
          <div className="col-md-12" style={styles.col}>
            <ConfigGuestButtonText wall={wall} />
          </div>
          <div className="col-md-12" style={styles.col}>
            {this.renderPricing()}
          </div>
          <div className="col-md-12" style={styles.col}>
            <ToggleExpiration wall={wall} />
          </div>
          <div className="col-md-12" style={styles.col}>
            <ToggleViewportConfig wall={wall} />
          </div>
          <div className="col-md-12" style={styles.col}>
            <ToggleAutoDecryption wall={wall} />
          </div>
          <div className="col-md-12" style={styles.col}>
            <ToggleUpselling wall={wall} />
          </div>
        </div>

        {!product.usingWordpress ?
          <div>
            <hr width="90%" />
            {this.renderContentFrom()}
            <br />
            {this.renderEmbedCode()}
          </div> : null}
      </div>
    );
  }

  renderCategories() {
    const { categories, wall } = this.props;
    const currentCategoryId = wall.categoryIds && wall.categoryIds[0] || '';

    if (!categories || !categories.length === 0) {
      return null;
    }

    return (
      <p>
        Category: <select
          onChange={this.changeCategory}
          value={currentCategoryId}
        >
          <option value="">
            No category
          </option>
          {
            categories.map((cat) =>
              <option
                value={cat._id}
                key={cat._id}
              >
                {cat.name}
              </option>
            )
          }
        </select>
      </p>
    );
  }

  renderUpsellingButton() {
    const { updateEmbedlyData } = this.props;

    return (
      <p>
        Update page's data for Upselling lists:
        <button
          className="btn btn-default margin-10"
          onClick={updateEmbedlyData}
        >
          Update
        </button>
      </p>
    );
  }

  render() {
    const { product, wall } = this.props;

    if (!product) {
      return <span></span>;
    }

    return (
      <div className="tab-content package1">
        <a className="btn btn-default margin-10" href="/">
          Go back
        </a>

        <div className="title-url">
          <p>Page Title: {wall.title ? `${wall.title} - ` : ''}</p>
          <p>
            Page URL: <a href={`http://${wall.url}`} target="_blank">
              {wall.url}
            </a>
          </p>

          <p>
            Price: ${(wall.price / 100).toFixed(2)}
          </p>
          <p>
            Auto-CPM: {this.autoCpm(wall)}
          </p>
          <p>
            Created: {moment(wall.createdAt).format('DD MMM YYYY')}
          </p>

          {this.renderCategories()}
          {this.renderUpsellingButton()}
        </div>

        <div style={{ backgroundColor: '#f9f9f9' }}>
          <h3 className="text-center pad20">Paywall status</h3>
          <p className="text-center">
            Disable paywall without deleting paywall's embed code to your webpage.
          </p>
          <table className="margin-auto">
            <tbody>
              <tr>
                <td>OFF</td>
                <td className="text-center">
                  <Toggle
                    id="disabled-switch"
                    checked={!wall.disabled}
                    onChange={this.toggleDisabled}
                  />
                  <div className="onoffswitch" style={{ display: 'none' }}>
                    <input
                      id="disabled-switch"
                      type="checkbox"
                      className="onoffswitch-checkbox"
                      checked={!wall.disabled}
                      onChange={this.toggleDisabled}
                    />
                    <label className="onoffswitch-label" htmlFor="disabled-switch">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </td>
                <td>ON</td>
              </tr>
            </tbody>
          </table>
        </div>


        {!wall.disabled ? this.renderForm() : ''}
      </div>
    );
  }
}

ManageContentWall.propTypes = {
  product: PropTypes.object.isRequired,
  wall: PropTypes.object.isRequired,
  toggleDisabled: PropTypes.func.isRequired,
  saveContent: PropTypes.func.isRequired,
  saveImage: PropTypes.func.isRequired,
  toggleAutoDecryption: PropTypes.func.isRequired,
  toggleFixedPricing: PropTypes.func.isRequired,
  saveAutoDecryptionConfig: PropTypes.func.isRequired,
  saveFixedPrice: PropTypes.func.isRequired,
  toggleVideo: PropTypes.func.isRequired,
  changeCategory: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  updateEmbedlyData: PropTypes.func.isRequired,
  isVimeoConnected: PropTypes.bool.isRequired,
};
