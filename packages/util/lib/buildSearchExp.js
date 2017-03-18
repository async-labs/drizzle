import { _ } from 'meteor/underscore';

export default (searchText) => {
  const words = searchText.trim().split(/[ \-\:]+/);
  const exps = _.map(words, (word) => `(?=.*${word})`);
  const fullExp = `${exps.join('')}.+`;
  return new RegExp(fullExp, 'i');
};
