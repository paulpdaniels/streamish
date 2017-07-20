/**
 * Created by paulp on 7/4/2017.
 */

import pipe from "../src/stream/operators/pipe";
import subscribe from "../src/stream/operators/subscribe";
import {Stream} from "../src/stream/Stream";
import head from "../src/stream/operators/head";
import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should take only the head of a stream', sandbox(scheduler => () => {

  pipe(
    head(),
    jestSubscribe('a|')
  )(scheduler.createHotStream('abcd|'), scheduler);

  scheduler.flush();
}));

test('should return empty if no values are present', sandbox(scheduler => () => {

  pipe(
    head(),
    jestSubscribe('|')
  )(Stream([]), scheduler);

  scheduler.flush();

}));

