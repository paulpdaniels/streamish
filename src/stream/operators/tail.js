/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
"use strict";
const skip = require('./skip');

function tail() {
  return skip(1);
}

module.exports = tail;