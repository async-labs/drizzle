import React, { PropTypes } from 'react';

const styles = {
  paywallHeader: {
    hr: {
      width: '100%',
      borderTop: '1px solid #64baeb',
      backgroundColor: '#64baeb',
      marginBottom: '5px',
    },
    iconContainer: {
      float: 'right',
      marginBottom: '5px',
      fontSize: '18px',
      opacity: '0.6',
    },
    topLeftMessage: {
      float: 'left',
      marginBottom: '5px',
      fontSize: '14px',
      opacity: '0.6',
    },
  },
  paywallBody: {
    textAlign: 'center',
    clear: 'both',
    marginBottom: 20,
    marginTop: 35,
  },
};

const PaywallLayout = ({
  wall,
  isClientSide,
  children,
  style,
  topLeftMessage,
}) => (
  <div style={style}>
    <hr style={styles.paywallHeader.hr} />

    {wall.upvoteCount >= 10 ?
      <span
        title="Number of upvotes"
        style={styles.paywallHeader.iconContainer}
      >
        <i
          className="fa fa-heart-o"
          aria-hidden="true"
          title="Number of upvotes"
        >
        </i>&nbsp;{wall.upvoteCount || 0}
      </span> : null}

    {topLeftMessage ? (
      <span
        title="Social Proof"
        style={styles.paywallHeader.topLeftMessage}
      >
        {topLeftMessage}
      </span>
    ) : null}

    <div style={styles.paywallBody}>
      {children}
    </div>

    {wall.content && wall.content.original ? (
      isClientSide ?
        <div className="drizzle-client-side-content" />
        : <div dangerouslySetInnerHTML={{ __html: wall.content.original }} />
    ) : null}
  </div>
);

PaywallLayout.propTypes = {
  wall: PropTypes.shape({
    upvoteCount: PropTypes.number,
    content: PropTypes.shape({
      original: PropTypes.string,
      thumbnail: PropTypes.string,
    }),
  }).isRequired,

  isClientSide: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  topLeftMessage: PropTypes.string,
};

PaywallLayout.defaultProps = {
  wall: {
    upvoteCount: 0,
    content: {
      thumbnail: 'https://s3-us-west-1.amazonaws.com/zenmarket/video-placeholder.png',
    },
  },
};

export default PaywallLayout;
