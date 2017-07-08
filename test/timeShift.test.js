/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import {Stream} from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import timeShift from '../src/stream/operators/delay';
import {sandbox} from './helpers/sandbox';
import pipe from "../src/stream/operators/pipe";
import {Record} from "../src/stream/operators/notification";

test('should delay emission of events', sandbox(scheduler => () => {

  const actual = [];
  subscribe(v => actual.push(v))(
    timeShift(10)(Stream([1, 2, 3]), scheduler)
  );

  expect(actual).toEqual([]);

  scheduler.advanceTo(10);

  expect(actual).toEqual([1, 2, 3]);
}));

test('should forward errors immediately', sandbox(scheduler => () => {

  const {next, error, complete} = Record;
  const result = [];
  const errors = [];

  const stream = scheduler.createHotStream(
    next(10, 1),
    next(20, 2),
    error(30, 42),
    next(40, 3)
  );

  pipe(
    timeShift(10),
    subscribe(x => result.push(x), e => errors.push(e))
  )(stream, scheduler);

  scheduler.advanceTo(50);

  expect(errors).toEqual([42]);
  expect(result).toEqual([1]);

}));