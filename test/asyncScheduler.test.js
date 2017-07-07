/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { AsyncScheduler } from '../src/stream/schedulers/asyncScheduler';
import { sandbox } from './helpers/sandbox';
import { FakeWindow } from './helpers/fakeWindow';

test('should schedule tasks asynchronously', sandbox(testScheduler => () => {
  // Use the test scheduler to test all the other Schedulers
  const fakeWindow = new FakeWindow(testScheduler);
  const scheduler = new AsyncScheduler(fakeWindow);
  let actual;

  scheduler.schedule(42, 5,
    s => actual = s
  );

  testScheduler.advanceBy(10);

  expect(actual).toBe(42);

}));