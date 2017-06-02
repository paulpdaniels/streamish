/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
const Stream = require('../src/stream/Stream');
const subscribe = require('../src/stream/operators/subscribe');
const zip = require('../src/stream/operators/zip');


test('Can zip streams', () => {

  let array = [];

  const stream1 = Stream([1, 2, 3, 4]);
  const stream2 = Stream([5, 6, 7, 8]);

  subscribe(
    x => array.push(x),
    e => {throw e}
  )(zip((x, y) => x + y)(stream1, stream2));

  expect(array).toEqual([6, 8, 10, 12])

});