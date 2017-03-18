import React from 'react';

export default () => (
  <div className="template-not-found">
    <div
      id="not-found"
      className="package-notFound" style={{ backgroundColor: '#63BAEB', color: 'white' }}
    >
      <h1>Not Found</h1>
      <h4 className="fw600">
        The page that you requested doesn't exist.
      </h4>
    </div>
  </div>
);
