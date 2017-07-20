/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import filter from '../src/stream/operators/filter';
import {sandbox} from "./helpers/sandbox";
import pipe from "../src/stream/operators/pipe";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should filter stream by predicate', sandbox(scheduler => () => {
  const stream = Stream([1, 2, 3, 4]);

  pipe(
    filter(x => x % 2 === 0),
    jestSubscribe('(ab|)', {a: 2, b: 4})
  )(stream, scheduler);
}));

test('should halt on error', sandbox(scheduler => () => {

  const mapping = {a: 1, b: 2, c: 3};
  const stream = scheduler.createHotStream('-ab#c|', mapping);

  pipe(
    filter(x => x % 2 === 1),
    jestSubscribe('-a-#', mapping)
  )(stream, scheduler);

  scheduler.flush();

}));

test('should handle exceptions thrown from selector', sandbox(scheduler => () => {

  const stream = new Stream([1, 2, 3]);

  pipe(
    filter(() => { throw 42; }),
    jestSubscribe('#')
  )(stream, scheduler);

}));