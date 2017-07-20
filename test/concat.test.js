/**
 * Created by paulp on 7/4/2017.
 */

import pipe from "../src/stream/operators/pipe";
import concat from "../src/stream/operators/concat";
import {Stream} from "../src/stream/Stream";
import subscribe from "../src/stream/operators/subscribe";
import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should concat two streams together', sandbox(scheduler => () => {

  const left      = 'abcd|';
  const right     =     'efgh|';
  const expected  = 'abcdefgh|';

  const left$ = scheduler.createHotStream(left);
  const right$ = scheduler.createHotStream(right);

  pipe(
    concat(right$),
    jestSubscribe(expected)
  )(left$, scheduler);

  scheduler.flush();

}));