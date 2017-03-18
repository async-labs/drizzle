export default (score, date) => {
  const order = Math.log(Math.max(Math.abs(score), 1)) / Math.LN10;
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = date.getTime() / 1000 - 1134028003;
  return Number((order + sign * seconds / 45000 + 0.00000005).toFixed(7));
};
