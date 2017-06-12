import { connect } from 'react-redux';
import { addPromoCode } from '../actions';

import PromoCode from '../components/PromoCode';

const mapStateToProps = state => ({
  promoCode: state.user.promoCode,
});

const mapDispatchToProps = dispatch => ({
  onSubmit({ target } = event) {
    const { promoCode } = target;

    dispatch(addPromoCode(promoCode.value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PromoCode);
