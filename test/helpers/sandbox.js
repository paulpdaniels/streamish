/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
const TestScheduler = require('../../src/stream/schedulers/testScheduler');

/**
 * Simple sandbox wrapping operation that allows us to easily inject an instance of a scheduler
 * @param fn
 * @returns {*}
 */
function sandbox(fn) {
  const scheduler = new TestScheduler();
  return fn(scheduler);
}

module.exports = sandbox;