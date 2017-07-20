/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

'use strict';
import { Stream } from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import scan from '../src/stream/operators/scan';
import pipe from "../src/stream/operators/pipe";
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";
import {jestSubscribe} from "./helpers/testSubscribe";

const {next, error, complete} = Record;

test('should scan a stream', sandbox(scheduler => () => {

  const stream = Stream([1, 2, 3, 4]);

  pipe(
    scan((a, b) => a + b, 0),
    jestSubscribe('(abcd|)', {a: 1, b: 3, c: 6, d: 10})
  )(stream, scheduler);

  scheduler.flush();

}));

test('should forward errors downstream', sandbox(scheduler => () => {

  const input = [
    next(10, 1),
    next(20, 2),
    error(30, 42),
    next(40, 4),
    complete(50)
  ];
  const output = [
    next(10, 1),
    next(20, 3),
    error(30, 42)
  ];

  const stream = scheduler.createHotStream(...input);

  pipe(
    scan((a, b) => a + b, 0),
    jestSubscribe(...output)
  )(stream, scheduler);

    scheduler.advanceTo(60);

}));

test('should forward exceptions thrown from the selector', sandbox(scheduler => () => {

  const stream = Stream([1, 2, 3]);

  pipe(
    scan(() => { throw 42; }, 0),
    jestSubscribe('#')
  )(stream, scheduler);

  scheduler.flush();

}));
