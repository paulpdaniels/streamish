/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

import { TestScheduler } from '../src/stream/schedulers/testScheduler';


test('should be able to construct a TestScheduler', () => {
  const scheduler = new TestScheduler();

  expect(scheduler.frame).toBe(0);
  expect(scheduler.queue).toEqual([]);

});

test('should be able to schedule and execute an action', () => {
  const scheduler = new TestScheduler();

  const expected = 42;
  let actual;

  scheduler.schedule(expected, 10)(
    s => actual = s
  );

  scheduler.advanceBy(5);
  scheduler.advanceBy(5);

  expect(actual).toBe(expected);
});

test('should be able to schedule and execute an absolute action', () => {
  const scheduler = new TestScheduler();

  const expected = 42;
  let actual;

  scheduler.schedule(expected, 10)(
    s => actual = s
  );

  scheduler.advanceTo(10);

  expect(actual).toBe(expected);
});

test('should be able to execute actions in order', () => {
  const scheduler = new TestScheduler();

  const expected = [1, 2, 3];
  const actual = [];

  const push = (s) => actual.push(s);

  scheduler.schedule(2, 10)(push);

  scheduler.schedule(3, 20)(push);

  scheduler.schedule(1, 5)(push);

  scheduler.advanceTo(30);

  expect(actual).toEqual(expected);

});