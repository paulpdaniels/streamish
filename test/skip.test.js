/**
 * Created by paulp on 7/4/2017.
 */


import pipe from "../src/stream/operators/pipe";
import subscribe from "../src/stream/operators/subscribe";
import skip from "../src/stream/operators/skip";
import {Stream} from "../src/stream/Stream";
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";


test('should skip the set number of values', () => {

  const result = [];

  pipe(
    skip(2),
    subscribe(v => result.push(v))
  )(Stream([1, 2, 3, 4]));

  expect(result).toEqual([3, 4]);


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
    skip(1),
    subscribe(v => result.push(v), e => errors.push(e))
  )(stream, scheduler);

    scheduler.advanceTo(60);

    expect(result).toEqual([2]);
    expect(errors).toEqual([42]);

}));