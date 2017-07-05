/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe  from '../src/stream/operators/subscribe';
import streamMap   from '../src/stream/operators/flatMap';

test('Can flatMap a stream', () => {

  let array = [];
  const stream = Stream([3, 4]);

  subscribe(v => array.push(v))(streamMap(x => Stream([x * 2, x * 3]))(stream));

  expect(array).toEqual([6, 9, 8, 12]);

});