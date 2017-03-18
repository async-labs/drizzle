import React, { PropTypes } from 'react';

/**
 * Created to apply a random number on width percentage to make dynamic
 * placeholder paragraphs.
 */
const getRandomInt = (min, max) => {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
};

const ParagraphPlaceholder = ({ applyRandomWidth }) => (
  <div
    style={{
      width: applyRandomWidth ? `${getRandomInt(70, 90)}%` : '100%',
      height: '1em',
      borderRadius: 4,
      marginTop: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    }}
  >
  </div>
);

ParagraphPlaceholder.propTypes = {
  applyRandomWidth: PropTypes.bool,
};

ParagraphPlaceholder.defaultProps = {
  applyRandomWidth: false,
};

const ContentPlaceholder = ({ style }) => (
  <div style={style}>
    <ParagraphPlaceholder />
    <ParagraphPlaceholder />
    <ParagraphPlaceholder applyRandomWidth />
    <ParagraphPlaceholder applyRandomWidth />
    <br />
    <ParagraphPlaceholder />
    <ParagraphPlaceholder />
    <ParagraphPlaceholder applyRandomWidth />
    <br />
    <ParagraphPlaceholder applyRandomWidth />
    <ParagraphPlaceholder applyRandomWidth />
    <ParagraphPlaceholder applyRandomWidth />
    <ParagraphPlaceholder applyRandomWidth />
  </div>
);

ContentPlaceholder.propTypes = {
  style: PropTypes.object,
};

export default ContentPlaceholder;
