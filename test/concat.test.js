/**
 * Created by paulp on 7/4/2017.
 */

import pipe from "../src/stream/operators/pipe";
import concat from "../src/stream/operators/concat";
import {Stream} from "../src/stream/Stream";
import subscribe from "../src/stream/operators/subscribe";

test('should concat two streams together', () => {

  const result = [];

  pipe(
    concat(Stream([5, 6, 7, 8])),
    subscribe(v => result.push(v))
  )(Stream([1, 2, 3, 4]));

  expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

});