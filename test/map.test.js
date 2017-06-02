/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

const Stream = require('../src/stream/Stream');
const subscribe = require('../src/stream/operators/subscribe');
const map = require('../src/stream/operators/map');

test('Can map a stream', () => {

  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  subscribe({
    next(v) {
      array.push(v);
    },
    error(e) {
      throw e;
    }
  })(map(x => x * x)(stream));

  expect(array).toEqual([1, 4, 9, 16]);

});