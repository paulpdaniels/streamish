/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";
import { Stream } from '../src/stream/Stream';
import pipe from '../src/stream/operators/pipe';
import combine from '../src/stream/operators/combine';
import subscribe from '../src/stream/operators/subscribe';
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";


test('should combine two streams with the latest output', () => {

  const result = [];
  const stream1 = Stream([1, 2, 3, 4]);
  const stream2 = Stream([5, 6, 7, 8]);

  pipe(
    combine((...a) => a, stream2),
    subscribe(x => result.push(x))
  )(stream1);

  expect(result).toEqual([[4,5],[4,6],[4,7],[4,8]]);

});

test('should forward errors from the primary stream', sandbox(scheduler => () => {

  const {next, error, complete} = Record;
  const result = [];
  const errors = [];

  const primary = scheduler.createHotStream('-a--#', {a: 1});
  const secondary = scheduler.createHotStream(next(15, 2), next(20, 3), complete(100));

  pipe(
    combine((...a) => a, secondary),
    subscribe(x => result.push(x), e => errors.push(e))
  )(primary, scheduler);

    scheduler.advanceTo(100);

  expect(result).toEqual([[1, 2], [1, 3]]);
  expect(errors).toEqual([42]);

}));

test('should forward errors from the selector', sandbox(scheduler => () => {
  const {next, error, complete} = Record;
  const result = [];
  const errors = [];

  const primary = scheduler.createHotStream(next(10, 1));
  const secondary = scheduler.createHotStream(next(15, 2), next(20, 3), complete(100));

  pipe(
    combine((...a) => {throw 42}, secondary),
    subscribe(x => result.push(x), e => errors.push(e))
  )(primary, scheduler);

  scheduler.advanceTo(100);

  expect(result).toEqual([]);
  expect(errors).toEqual([42]);
}));