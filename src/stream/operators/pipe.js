/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import _pipe from './internal/_pipe';

export default function pipe(...operators) {
  const [head, ...tail] = operators;
  return _pipe(head, tail);
}