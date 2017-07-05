/**
 * Created by paulp on 7/4/2017.
 */

import pipe from "../src/stream/operators/pipe";
import subscribe from "../src/stream/operators/subscribe";
import {Stream} from "../src/stream/Stream";
import head from "../src/stream/operators/head";

test('should take only the head of a stream', () => {

  const result = [];

  pipe(
    head(),
    subscribe(v => result.push(v))
  )(Stream([1, 2, 3, 4]));

  expect(result).toEqual([1]);

});

test('should return empty if no values are present', () => {

  const result = [];

  pipe(head(), subscribe(v => result.push(v)))(Stream([]));

  expect(result).toEqual([]);

});