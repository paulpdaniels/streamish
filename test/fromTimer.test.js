/**
 * Created by paulp on 7/8/2017.
 */

import fromTimer from "../src/stream/source/fromTimer";
import {sandbox} from "./helpers/sandbox";
import subscribe from "../src/stream/operators/subscribe";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should fire the timer after a set amount of time', sandbox(scheduler => () => {

  const timer = fromTimer(100, scheduler);
  jestSubscribe('----------(a|)', {a: 0})(timer, scheduler);

  scheduler.flush();

}));

test('should continue emitting events if period is defined', sandbox(scheduler => () => {

  const timer = fromTimer(0, 10, scheduler);
  jestSubscribe('abcdef', {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5})(timer, scheduler);

  scheduler.advanceTo(50);

}));

test('should throw if the timer cannot be constructed', sandbox(scheduler => () => {
  expect(() => fromTimer()).toThrow();
}));