import {sandbox} from "./helpers/sandbox";
import pipe from "../src/stream/operators/pipe";
import {jestSubscribe} from "./helpers/testSubscribe";
import buffer from "../src/stream/operators/buffer";

test('should emit buffers of a specific length', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('-a-b-c-d|');

  pipe(
    buffer(2),
    jestSubscribe('---a---b|', {a: ['a', 'b'], b: ['c', 'd']})
  )(stream, scheduler);

  scheduler.flush();

}));

test('should forward errors from the source', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('-a-#');

  pipe(
    buffer(2),
    jestSubscribe('---#')
  )(stream, scheduler);

  scheduler.flush();

}));

test('should emit remaining buffer on completion', sandbox(scheduler => () => {
  const stream = scheduler.createHotStream('-a-b-c-|');

  pipe(
    buffer(2),
    jestSubscribe('---a---(b|)', {a: ['a', 'b'], b: ['c']})
  )(stream, scheduler);

  scheduler.flush();
}));