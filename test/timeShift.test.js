/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import timeShift from '../src/stream/operators/delay';
import { sandbox } from './helpers/sandbox';

test('should delay emission of events', sandbox(scheduler => () => {

  const actual = [];
  subscribe(v => actual.push(v))(
    timeShift(10, scheduler)(Stream([1, 2, 3]))
  );

  expect(actual).toEqual([]);

  scheduler.advanceTo(10);

  expect(actual).toEqual([1, 2, 3]);
}));