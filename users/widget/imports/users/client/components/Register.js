import React, { PropTypes } from 'react';
import RegisterForm from '/imports/ui/components/RegisterForm';

const Register = ({
  isSubmiting,
  onFacebookClick,
  onSubmit,
  benefits,
  showPromoCodeLink,
  promoCode,
}) => (
  <div>
    {benefits && (
      <div>
        <p className="pad10">Benefits</p>
        <ul>
          {benefits.map(b => <li key={b}>{b}</li>)}
        </ul>
      </div>
    )}

    <RegisterForm
      isSubmiting={isSubmiting}
      onSubmit={onSubmit}
      onFacebookClick={onFacebookClick}
      showPromoCodeLink={showPromoCodeLink}
      promoCode={promoCode}
    />
  </div>
);

Register.propTypes = {
  isSubmiting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onFacebookClick: PropTypes.func.isRequired,
  showPromoCodeLink: PropTypes.bool.isRequired,
  benefits: PropTypes.array,
  promoCode: PropTypes.string,
};

export default Register;
