/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import scan from '../src/stream/operators/scan';

test('Can scan a stream', () => {

  let array = [];
  const stream = Stream([1, 2, 3, 4]);

  subscribe(v => array.push(v))(scan((a, b) => a + b, 0)(stream));

  expect(array).toEqual([1, 3, 6, 10]);

});