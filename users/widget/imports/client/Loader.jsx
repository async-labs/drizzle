import React from 'react';

export default function Loader() {
  return (
    <div
      style={{
        backgroundImage: 'url(https://s3-us-west-1.amazonaws.com/zenmarket/loading.gif)',
        width: '100%',
        height: '50px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '50px 50px',
      }}
    >
    </div>
  );
}
