'use strict';
import compose from '../src/stream/operators/compose';
import { Stream } from '../src/stream/Stream';
import filter from '../src/stream/operators/filter';
import map from '../src/stream/operators/map';
import subscribe from '../src/stream/operators/subscribe';
import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";

const adder = a => b => b + a;


test('should compose functions in reverse order', () => {

  expect(compose(
    adder("something."),
    adder("writing "),
    adder("am ")
  )("I ")).toBe("I am writing something.");

});

test('Can compose operators together', sandbox(scheduler => () => {

  const stream = Stream([1, 2, 3, 4]);

  compose(
    jestSubscribe('(ab|)', {a: 0, b: 4}),
    map(x => x * x),
    filter(x => x % 2 === 0),
    map(x => x - 1)
  )(stream, scheduler);

  scheduler.flush();
}));
