/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import scan from '../src/stream/operators/scan';
import pipe from "../src/stream/operators/pipe";
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";

test('should scan a stream', () => {

  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  pipe(
    scan((a, b) => a + b, 0),
    subscribe(v => array.push(v))
  )(stream);

  expect(array).toEqual([1, 3, 6, 10]);

});

test('should forward errors downstream', sandbox(scheduler => () => {

  const result = [];
  const errors = [];

  const {next, error, complete} = Record;

  const stream = scheduler.createHotStream(
    next(10, 1),
    next(20, 2),
    error(30, 42),
    next(40, 4),
    complete(50)
  );

  pipe(
    scan((a, b) => a + b, 0),
    subscribe(v => result.push(v), e => errors.push(e))
  )(stream, scheduler);

    scheduler.advanceTo(60);

    expect(result).toEqual([1, 3]);
    expect(errors).toEqual([42]);
}));

test('should forward exceptions thrown from the selector', () => {

  const result = [];
  const errors = [];

  const stream = Stream([1, 2, 3]);

  pipe(
    scan((a, b) => { throw 42; }, 0),
    subscribe(v => result.push(v), e => errors.push(e))
  )(stream);

    expect(result).toEqual([]);
    expect(errors).toEqual([42]);

});
