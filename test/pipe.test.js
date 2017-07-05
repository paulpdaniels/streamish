/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

import pipe from '../src/stream/operators/pipe';
import { Stream } from '../src/stream/Stream';
import filter from '../src/stream/operators/filter';
import map from '../src/stream/operators/map';
import subscribe from '../src/stream/operators/subscribe';

const adder = a => b => b + a;

test('should be able to pipe functions in order', () => {

  expect(pipe(
    adder("am "),
    adder("writing "),
    adder("something.")
  )("I ")).toEqual("I am writing something.");

});

test('Can pipe operators together', () => {
  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  pipe(
    map(x => x - 1),
    filter(x => x % 2 === 0),
    map(x => x * x),
    subscribe(v => array.push(v))
  )(stream);

  expect(array).toEqual([0, 4]);
});