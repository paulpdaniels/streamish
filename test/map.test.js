/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

import {Stream} from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import map from '../src/stream/operators/map';
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";
import pipe from "../src/stream/operators/pipe";

test('Can map a stream', () => {

  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  subscribe({
    next(v) {
      array.push(v);
    },
    error(e) {
      throw e;
    }
  })(map(x => x * x)(stream));

  expect(array).toEqual([1, 4, 9, 16]);

});

test('should forward exceptions', sandbox(scheduler => () => {

  const {next, error, complete} = Record;
  const result = [];
  const errors = [];
  const stream = scheduler.createHotStream(
    next(10, 1),
    next(20, 2),
    error(30, 42),
    next(40, 3),
    next(50, 4),
    complete(60)
  );

  pipe(
    map(x => x * 2),
    subscribe(x => result.push(x), e => errors.push(e))
  )(stream);

  scheduler.advanceTo(100);

  expect(result).toEqual([2, 4]);
  expect(errors).toEqual([42]);

}));

test('should catch user errors', () => {

  const errors = [];
  const result = [];
  const stream = Stream([1, 2, 3, 4]);

  pipe(
    map(_ => {
      throw 42;
    }),
    subscribe(
      x => result.push(x),
      e => errors.push(e)
    )
  )(stream);

  expect(result).toEqual([]);
  expect(errors).toEqual([42]);

});