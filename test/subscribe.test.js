/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";
const Stream = require('../src/stream/Stream');
const subscribe = require('../src/stream/operators/subscribe');


test('should handle anonymous functions', () => {

  let actual;
  subscribe(v => actual = v)(Stream([42]));

  expect(actual).toBe(42);

});

test('should handle empty handlers', () => {
  subscribe()(Stream([42]));
});

test('should handle object handlers', () => {
  const actual = [];
  subscribe({
    next(v) { actual.push(v); },
    complete() { actual.push('completed'); }
  })(Stream([42]));

  expect(actual).toEqual([42, 'completed']);
});