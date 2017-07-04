/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
"use strict";
const take = require('./take');

function head() {
  return take(1);
}

module.exports = head;