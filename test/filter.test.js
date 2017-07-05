/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import filter from '../src/stream/operators/filter';

test('Can filter a stream', () => {
  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  subscribe({
    next(v) {
      array.push(v);
    }
  })(filter(x => x % 2 === 0)(stream));

  expect(array).toEqual([2, 4])
});