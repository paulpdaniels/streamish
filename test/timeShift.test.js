/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
const Stream = require('../src/stream/Stream');
const TestScheduler = require('../src/stream/schedulers/testScheduler');
const subscribe = require('../src/stream/operators/subscribe');
const timeShift = require('../src/stream/operators/delay');

test('should delay emission of events', () => {

  const scheduler = new TestScheduler();

  const actual = [];
  subscribe(v => actual.push(v))(
    timeShift(10, scheduler)(Stream([1, 2, 3]))
  );

  expect(actual).toEqual([]);

  scheduler.advanceTo(10);

  expect(actual).toEqual([1, 2, 3]);
});