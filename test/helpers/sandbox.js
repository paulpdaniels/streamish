/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import {TestScheduler} from '../../src/stream/schedulers/testScheduler';

/**
 * Simple sandbox wrapping operation that allows us to easily inject an instance of a scheduler
 * @param fn
 * @returns {*}
 */
export function sandbox(fn) {
  const scheduler = new TestScheduler();
  return fn(scheduler);
}