/**
 * Created by paulp on 7/4/2017.
 */


import pipe from "../src/stream/operators/pipe";
import subscribe from "../src/stream/operators/subscribe";
import skip from "../src/stream/operators/skip";
import {Stream} from "../src/stream/Stream";
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";
import {jestSubscribe} from "./helpers/testSubscribe";


test('should skip the set number of values', sandbox(scheduler => () => {

  pipe(
    skip(2),
    jestSubscribe('(cd|)')
  )(Stream('abcd'), scheduler);

  scheduler.flush();
}));

test('should forward exceptions downstream', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('ab#c|', {a: 1, b: 2, c: 40});

  pipe(
    skip(1),
    jestSubscribe('-b#', {b: 2})
  )(stream, scheduler);

  scheduler.flush();


}));