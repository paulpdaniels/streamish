/**
 * Created by paulp on 7/12/2017.
 */

import fromIterable from '../src/stream/source/fromIterable';
import subscribe from '../src/stream/operators/subscribe';
import {sandbox} from "./helpers/sandbox";

test('should process an entire iterable without a scheduler', () => {

  const source = [1, 2, 3, 4];
  const result = [];
  const errors = [];

  subscribe(
    next => result.push(next),
    error => errors.push(error)
  )(fromIterable(source));

  expect(result).toEqual([1, 2, 3, 4]);

});

test('should process an entire iterable with a scheduler', sandbox(scheduler => () => {

  const source = [1, 2, 3, 4];
  const result = [];
  const errors = [];

  subscribe(
    next => result.push(next),
    error => errors.push(error)
  )(fromIterable(source, scheduler));

  expect(result).toEqual([]);

  scheduler.advanceBy(10);

  expect(result).toEqual([1,2,3,4]);

}));
