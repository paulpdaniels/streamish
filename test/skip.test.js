/**
 * Created by paulp on 7/4/2017.
 */


import pipe from "../src/stream/operators/pipe";
import subscribe from "../src/stream/operators/subscribe";
import skip from "../src/stream/operators/skip";
import {Stream} from "../src/stream/Stream";


test('should skip the set number of values', () => {

  const result = [];

  pipe(
    skip(2),
    subscribe(v => result.push(v))
  )(Stream([1, 2, 3, 4]));

  expect(result).toEqual([3, 4]);


});