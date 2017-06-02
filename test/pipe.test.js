/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

const pipe = require('../src/stream/operators/pipe');
const Stream = require('../src/stream/Stream');
const filter = require('../src/stream/operators/filter');
const map = require('../src/stream/operators/map');
const subscribe = require('../src/stream/operators/subscribe');

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