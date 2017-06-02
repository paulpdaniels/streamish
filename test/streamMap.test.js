/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
const Stream = require('../src/stream/Stream');
const subscribe = require('../src/stream/operators/subscribe');
const streamMap = require('../src/stream/operators/streamMap');

test('Can flatMap a stream', () => {

  let array = [];
  const stream = Stream([3, 4]);

  subscribe(v => array.push(v))(streamMap(x => Stream([x * 2, x * 3]))(stream));

  expect(array).toEqual([6, 9, 8, 12]);

});