/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */

const _pipe = require('./internal/_pipe');

function compose(...operators) {
  const [head, ...tail] = _reverse(operators);
  return _pipe(head, tail);
}

function _reverse(operators) {
  return Array.prototype.slice.call(operators, 0).reverse();
}

module.exports = compose;