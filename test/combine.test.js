/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";
import { Stream } from '../src/stream/Stream';
import pipe from '../src/stream/operators/pipe';
import combine from '../src/stream/operators/combine';
import subscribe from '../src/stream/operators/subscribe';


test('should combine two streams with the latest output', () => {

  const result = [];
  const stream1 = Stream([1, 2, 3, 4]);
  const stream2 = Stream([5, 6, 7, 8]);

  pipe(
    combine((...a) => a, stream2),
    subscribe(x => result.push(x))
  )(stream1);

  expect(result).toEqual([[4,5],[4,6],[4,7],[4,8]]);

});