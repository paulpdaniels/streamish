/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
const Stream = require('../src/stream/Stream');
const subscribe  = require('../src/stream/operators/subscribe');
const scan = require('../src/stream/operators/scan');

test('Can scan a stream', () => {

  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  subscribe(v => array.push(v))(scan((a, b) => a + b, 0)(stream));

  expect(array).toEqual([1, 3, 6, 10]);

});