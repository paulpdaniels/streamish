/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import {Stream} from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import zip from '../src/stream/operators/zip';
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";


test('Can zip streams', () => {

  let array = [];

  const stream1 = Stream([1, 2, 3, 4]);
  const stream2 = Stream([5, 6, 7, 8]);

  subscribe(
    x => array.push(x),
    e => {
      throw e
    }
  )(zip((x, y) => x + y, stream2)(stream1));

  expect(array).toEqual([6, 8, 10, 12])

});

test('should forward errors from primary stream', sandbox(scheduler => () => {

  const {error, next} = Record;
  const result = [];
  const errors = [];

  const primary = scheduler.createHotStream(next(15, 2), error(50, 42));
  const secondary = scheduler.createHotStream(next(10, 1), next(20, 3));

  subscribe(
    x => result.push(x),
    e => errors.push(e)
  )(zip((x, y) => x + y, secondary)(primary, scheduler));

  scheduler.advanceTo(100);

  expect(result).toEqual([3]);
  expect(errors).toEqual([42]);
}));

test('should forward errors from secondary stream', sandbox(scheduler => () => {

  const {error, next} = Record;
  const result = [];
  const errors = [];

  const primary = scheduler.createHotStream(next(15, 2), error(50, 42));
  const secondary = scheduler.createHotStream(next(10, 1), next(20, 3));

  subscribe(
    x => result.push(x),
    e => errors.push(e)
  )(zip((x, y) => x + y, primary)(secondary, scheduler));

  scheduler.advanceTo(100);

  expect(result).toEqual([3]);
  expect(errors).toEqual([42]);
}));