/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';

const subscribe = require('../src/stream/operators/subscribe');
const Stream = require('../src/stream/Stream');

test('Can construct a stream from an array', () => {
  let array = [];
  subscribe(v => array.push(v))(Stream([1, 2, 3, 4]));

  expect(array).toEqual([1, 2, 3, 4]);
});

test('Can construct a stream from a Promise', (done) => {

  let array = [];
  const promise = new Promise(resolve => resolve(42));
  subscribe(v => array.push(v), done, () => {
    expect(array).toEqual([42]);
    done();
  })(Stream(promise));
});
