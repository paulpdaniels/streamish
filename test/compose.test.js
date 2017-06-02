'use strict';
const compose = require('../src/stream/operators/compose');
const Stream = require('../src/stream/Stream');
const filter = require('../src/stream/operators/filter');
const map = require('../src/stream/operators/map');
const subscribe = require('../src/stream/operators/subscribe');

const adder = a => b => b + a;


test('should compose functions in reverse order', () => {

  expect(compose(
    adder("something."),
    adder("writing "),
    adder("am "),
  )("I ")).toBe("I am writing something.");

});

test('Can compose operators together', () => {

  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  compose(
    subscribe(v => array.push(v)),
    map(x => x * x),
    filter(x => x % 2 === 0),
    map(x => x - 1)
  )(stream);

  expect(array).toEqual([0, 4]);

});
