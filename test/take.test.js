/**
 * Created by paulp on 7/4/2017.
 */

import pipe from "../src/stream/operators/pipe";
import take from "../src/stream/operators/take";
import subscribe from "../src/stream/operators/subscribe";
import {Stream} from "../src/stream/Stream";
import {Record} from "../src/stream/operators/notification";
import {sandbox} from "./helpers/sandbox";

test('should take only the specified number of values', () => {

  const result = [];

  pipe(
    take(2),
    subscribe(a => result.push(a))
  )(Stream([1, 2, 3, 4]));

  expect(result).toEqual([1, 2]);

});

test('should forward exceptions downstream', sandbox(scheduler => () => {

  const result = [];
  const errors = [];

  const {next, error} = Record;

  const stream = scheduler.createHotStream(
    next(10, 1),
    next(20, 2),
    error(30, 42),
    next(40, 3)
  );

  pipe(
    take(3),
    subscribe(a => result.push(a), e => errors.push(e))
  )(stream, scheduler);

  scheduler.advanceTo(60);

  expect(result).toEqual([1, 2]);
  expect(errors).toEqual([42]);


}));