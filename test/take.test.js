/**
 * Created by paulp on 7/4/2017.
 */

import pipe from "../src/stream/operators/pipe";
import take from "../src/stream/operators/take";
import subscribe from "../src/stream/operators/subscribe";
import {Stream} from "../src/stream/Stream";
import {Record} from "../src/stream/operators/notification";
import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should take only the specified number of values', sandbox(scheduler => () => {

  pipe(
    take(2),
    jestSubscribe('(ab|)', {a: 1, b: 2})
  )(Stream([1, 2, 3, 4]), scheduler);

  scheduler.flush();
}));

test('should forward exceptions downstream', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('ab#c|', {a: 1, b: 2, c: 3});

  pipe(
    take(3),
    jestSubscribe('ab#', {a: 1, b: 2})
  )(stream, scheduler);

  scheduler.flush();
}));