/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

const _pipe = require('./internal/_pipe');

function pipe(...operators) {
  const [head, ...tail] = operators;
  return _pipe(head, tail);
}

module.exports = pipe;