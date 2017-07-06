/**
 * Created by paulp on 7/4/2017.
 */

import {sandbox} from "./helpers/sandbox";
import debounce from "../src/stream/operators/debounce";
import {Stream} from "../src/stream/Stream";
import subscribe from "../src/stream/operators/subscribe";
import pipe from "../src/stream/operators/pipe";
import {Record} from "../src/stream/operators/notification";

test('should debounce the values', sandbox(scheduler => () => {

  const result = [];
  const {next, complete} = Record;

  const stream = scheduler.createHotStream(
    next(1, 1),
    next(2, 2),
    next(3, 3),
    next(4, 4),
    complete(50)
  );

  pipe(
    debounce(10),
    subscribe(value => result.push(value))
  )(stream, scheduler);

  expect(result).toEqual([]);

  scheduler.advanceBy(50);

  expect(result).toEqual([4]);

}));

test('should emit at the end of the debounce period', sandbox(scheduler => () => {

  const {next, error, complete} = Record;
  const result = [];

  const stream = scheduler.createHotStream(
    next(10, 1),
    next(15, 2),
    next(30, 3),
    complete(45)
  );

  pipe(
    debounce(10),
    subscribe(value => result.push(value))
  )(stream, scheduler);

  scheduler.advanceBy(50);

  expect(result).toEqual([2, 3]);

}));

test('should forward errors immediately', sandbox(scheduler => () => {

  const { next, error, complete} = Record;
  const result = [];
  const theError = new Error('something bad');

  const stream = scheduler.createHotStream(
    next(10, 1),
    error(12, theError),
    next(25, 2),
    complete(50)
  );

  pipe(
    debounce(10),
    subscribe(
      next => result.push(next),
      error => result.push(error)
    )
  )(stream, scheduler);

  scheduler.advanceBy(50);

  expect(result).toEqual([theError]);

}));