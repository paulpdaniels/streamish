/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
"use strict";
import skip from './skip';

export default function tail() {
  return skip(1);
}

module.exports = tail;