import React, { PropTypes, Component } from 'react';

const styles = {
  title: {
    fontSize: '18px !important',
  },
  list: {
    listStyle: 'none !important',
    padding: '0 !important',
  },
  description: {
    fontSize: '14px !important',
  },
  thumbnail: {
    maxWidth: '200px !important',
    maxHeight: '90px !important',
    float: 'left !important',
    marginRight: '10px !important',
  },
};

export default class UpsellContent extends Component {
  renderRow(url) {
    let text = url.title || url.url;
    if (text.length > 70) {
      text = `${text.substr(0, 67)}...`;
    }

    let description = url.description;
    if (description && description.length > 200) {
      description = `${description.substr(0, 197)}...`;
    }

    return (
      <li key={url._id}>
        <a href={`http://${url.url}`} target="_blank">
          <h4 style={styles.title}>{text}</h4>
        </a>
        <div>
          {url.thumbnailUrl ?
            <a href={`http://${url.url}`} target="_blank">
              <img
                style={styles.thumbnail}
                src={url.thumbnailUrl}
                alt="Thumbnail"
              />
            </a> : null}
          {url.description ?
            <p style={styles.description}>
              {url.description} <a href={`http://${url.url}`} target="_blank">
                Read more...
              </a>
            </p> : null}
        </div>
        <div style={{ clear: 'both' }}></div>
      </li>
    );
  }

  renderPopular({ visible }) {
    const { popularWalls } = this.props;
    if (!popularWalls || popularWalls.length === 0) {
      return null;
    }

    return (
      <li style={!visible ? { display: 'none' } : {}}>
        <ul style={styles.list}>
          {popularWalls.map(w => this.renderRow(w))}
        </ul>
      </li>
    );
  }

  renderTrending() {
    const { trendingWalls } = this.props;
    if (!trendingWalls || trendingWalls.length === 0) {
      return null;
    }

    return (
      <li>
        <ul style={styles.list}>
          {trendingWalls.map(w => this.renderRow(w))}
        </ul>
      </li>
    );
  }

  renderNewest({ visible }) {
    const { newestWalls } = this.props;
    if (!newestWalls || newestWalls.length === 0) {
      return null;
    }

    return (
      <li style={!visible ? { display: 'none' } : {}}>
        <ul style={styles.list}>
          {newestWalls.map(w => this.renderRow(w))}
        </ul>
      </li>
    );
  }

  renderRelated({ visible }) {
    const { relatedUrls, wall } = this.props;
    if (!wall || !relatedUrls || relatedUrls.length === 0) {
      return null;
    }

    const urls = relatedUrls.map(relUrl => {
      const url = relUrl.wallIdA === wall._id ? relUrl.urlB : relUrl.urlA;
      const title = relUrl.wallIdA === wall._id ? relUrl.titleB : relUrl.titleA;
      const thumbnailUrl = relUrl.wallIdA === wall._id ? relUrl.thumbnailUrlB : relUrl.thumbnailUrlA;
      const description = relUrl.wallIdA === wall._id ? relUrl.descriptionB : relUrl.descriptionA;

      return { _id: relUrl._id, url, title, description, thumbnailUrl };
    });

    return (
      <li style={!visible ? { display: 'none' } : {}}>
        <ul style={styles.list}>
          {urls.map(w => this.renderRow(w))}
        </ul>
      </li>
    );
  }

  render() {
    const trending = this.renderTrending();
    const popular = this.renderPopular({ visible: !trending });
    const related = this.renderRelated({ visible: !popular && !trending });
    const newest = this.renderNewest({ visible: !related && !popular && !trending });

    return (
      <div className="zenmarket--upsell-content zenmarket--tabs">
        <ul className="zenmarket--tab-list">
          {trending ? <li className="zenmarket--tabs-active">Trending</li> : null}
          {popular ? <li className={!trending ? 'zenmarket--tabs-active' : ''}>Popular</li> : null}
          {related ?
            <li className={!popular && !trending ? 'zenmarket--tabs-active' : ''}>Similar</li>
            : null}
          {newest ?
            <li className={!related && !popular && !trending ? 'zenmarket--tabs-active' : ''}>
              Newest
            </li>
            : null}
          <div style={{ clear: 'both' }}></div>
        </ul>

        <ul className="zenmarket--tab-panels">
          {trending}
          {popular}
          {related}
          {newest}
        </ul>
      </div>
    );
  }
}

UpsellContent.propTypes = {
  wall: PropTypes.object.isRequired,
  popularWalls: PropTypes.array,
  relatedUrls: PropTypes.array,
  trendingWalls: PropTypes.array,
  newestWalls: PropTypes.array,
};
