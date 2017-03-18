import React, { PropTypes, Component } from 'react';

const styles = {
  videoImg: {
    width: '100%',
  },
  hiddenVideoImg: {
    width: '100%',
    display: 'none',
  },
  sliderDiv: {
    marginTop: '20px',
    cursor: 'progress',
  },
};

class PaywallVideoThumbnail extends Component {
  renderSlider(images) {
    return (
      <div className="drizzle--wall-slider" style={styles.sliderDiv}>
        {images.map((img, i) => (
          <img
            src={img}
            key={i}
            alt="Thumbnail"
            style={i === 0 ? styles.videoImg : styles.hiddenVideoImg}
          />
        ))}
      </div>
    );
  }

  render() {
    const { wall } = this.props;

    const { content } = wall;

    if (!content) {
      return (
        <div>
          <img
            src={'https://s3-us-west-1.amazonaws.com/zenmarket/video-placeholder.png'}
            alt="Thumbnail"
            style={styles.videoImg}
          />
        </div>
      );
    }

    if (content.thumbnails && content.thumbnails.length > 0) {
      return this.renderSlider(content.thumbnails);
    }

    return (
      <div>
        <img
          src={content.thumbnail || 'https://s3-us-west-1.amazonaws.com/zenmarket/video-placeholder.png'}
          alt="Thumbnail"
          style={styles.videoImg}
        />
      </div>
    );
  }
}

PaywallVideoThumbnail.propTypes = {
  wall: PropTypes.object,
};

export default PaywallVideoThumbnail;
