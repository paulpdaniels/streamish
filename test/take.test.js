/**
 * Created by paulp on 7/4/2017.
 */

import pipe from "../src/stream/operators/pipe";
import take from "../src/stream/operators/take";
import subscribe from "../src/stream/operators/subscribe";
import {Stream} from "../src/stream/Stream";

test('should take only the specified number of values', () => {

  const result = [];

  pipe(
    take(2),
    subscribe(a => result.push(a))
  )(Stream([1, 2, 3, 4]));

  expect(result).toEqual([1,2]);

});