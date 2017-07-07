/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import {Stream} from '../src/stream/Stream';
import subscribe  from '../src/stream/operators/subscribe';
import flatMap   from '../src/stream/operators/flatMap';
import pipe from "../src/stream/operators/pipe";
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";

test('Can flatMap a stream', () => {

  let array = [];
  const stream = Stream([3, 4]);

  pipe(
    flatMap(x => Stream([x * 2, x * 3])),
    subscribe(v => array.push(v))
  )(stream);

  expect(array).toEqual([6, 9, 8, 12]);

});

test('should halt on error', sandbox(scheduler => () => {

  const result = [];
  const errors = [];

  const {next, error, complete} = Record;

  const stream = scheduler.createHotStream(
    next(10, 1),
    next(20, 2),
    error(30, 42),
    next(40, 3),
    complete(100)
  );

  pipe(
    flatMap(x => Stream([x * 2])),
    subscribe(x => result.push(x), e => errors.push(e))
  )(stream, scheduler);

  scheduler.advanceTo(100);

  expect(result).toEqual([2, 4]);
  expect(errors).toEqual([42]);

}));

test('should limit concurrent streams', sandbox(scheduler => () => {

  const result = [];

  const {next, error, complete} = Record;

  const stream = scheduler.createHotStream(
    next(10, 30),
    next(20, 50),
    next(40, 60),
    complete(500)
  );



  pipe(
    flatMap(x => scheduler.createHotStream(next(x, x), complete(x + 1)), 1),
    subscribe(x => result.push(x))
  )(stream, scheduler);


  scheduler.advanceTo(500);

  expect(result).toEqual([30, 50, 60]);

}));

test('should forward exceptions from inner streams', sandbox(scheduler => () => {
  const result = [];
  const errors = [];

  const {next, error, complete} = Record;

  const stream = scheduler.createHotStream(
    next(10, 1),
    next(20, 2),
    next(40, 3),
    complete(100)
  );

  pipe(
    flatMap(x => scheduler.createHotStream(error(30, 42))),
    subscribe(x => result.push(x), e => errors.push(e))
  )(stream, scheduler);

  scheduler.advanceTo(100);

  expect(errors).toEqual([42]);
  expect(result).toEqual([]);

}));