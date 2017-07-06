/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';

import _pipe from './internal/_pipe';
import _reverse from "./internal/_reverse";

export default function compose(...operators) {
  const [head, ...tail] = _reverse(operators);
  return _pipe(head, tail);
}