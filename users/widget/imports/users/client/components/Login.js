import React, { PropTypes } from 'react';
import LoginForm from '/imports/ui/components/LoginForm';

const Login = ({ onSubmit, onFacebookClick, isSubmiting, product }) => (
  <div>
    <LoginForm
      onSubmit={onSubmit}
      onFacebookClick={onFacebookClick}
      isSubmiting={isSubmiting}
    />
    <p className="center margin-t-20" style={{ fontSize: '13px' }}>
      {product.title || product.url} in partnership with <a href="https://getdrizzle.com" target="_blank">Drizzle</a>
    </p>
  </div>
);


Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFacebookClick: PropTypes.func.isRequired,
  isSubmiting: PropTypes.bool.isRequired,
  product: PropTypes.object,
};

export default Login;
