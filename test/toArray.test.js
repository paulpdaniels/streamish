import toArray from "../src/stream/operators/toArray";
import pipe from "../src/stream/operators/pipe";
import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should buffer entire stream into an array', sandbox(scheduler => () => {

  const values = [1, 2, 3, 4];

  const stream = scheduler.createHotStream('abcd|', {a: 1, b: 2, c: 3, d: 4});

  pipe(
    toArray(),
    jestSubscribe('----(a|)', {a: values})
  )(stream, scheduler);

    scheduler.advanceTo(50);

}));

test('should forward errors downstream', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('-ab#c|', {a: 1, b: 2, c: 3});

  pipe(
    toArray(),
    jestSubscribe('---#')
  )(stream, scheduler);

  scheduler.advanceTo(100);

}));