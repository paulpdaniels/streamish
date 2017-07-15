/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import filter from '../src/stream/operators/filter';
import {Record} from "../src/stream/operators/notification";
import {sandbox} from "./helpers/sandbox";
import pipe from "../src/stream/operators/pipe";

test('should filter stream by predicate', () => {
  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  subscribe({
    next(v) {
      array.push(v);
    }
  })(filter(x => x % 2 === 0)(stream));

  expect(array).toEqual([2, 4])
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
    filter(x => x % 2 === 1),
    subscribe(x => result.push(x), e => errors.push(e))
  )(stream, scheduler);

  scheduler.advanceTo(100);

  expect(result).toEqual([1]);
  expect(errors).toEqual([42]);

}));

test('should handle exceptions thrown from selector', () => {

  const errors = [];
  const result = [];
  const stream = new Stream([1, 2, 3]);

  pipe(
    filter(x => { throw 42; }),
    subscribe(x => result.push(x), e => errors.push(e))
  )(stream);

    expect(result).toEqual([]);
    expect(errors).toEqual([42]);

});