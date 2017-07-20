/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

'use strict';

import {Stream} from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import map from '../src/stream/operators/map';
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";
import pipe from "../src/stream/operators/pipe";
import {jestSubscribe} from "./helpers/testSubscribe";

test('Can map a stream', sandbox(scheduler => () => {

  const input = 'abcd|';
  const expected = 'abcd|';

  const stream = scheduler.createHotStream(input, {a: 1, b: 2, c: 3, d: 4});

  pipe(
    map(x => x * x),
    jestSubscribe(expected, {a: 1, b: 4, c: 9, d: 16})
  )(stream, scheduler);

  scheduler.flush();
}));

test('should forward exceptions', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('-ab#cd|', {a: 1, b: 2, c: 3, d: 4});

  pipe(
    map(x => x * 2),
    jestSubscribe('-ab#', {a: 2, b: 4})
  )(stream, scheduler);

  scheduler.flush();
}));

test('should catch user errors', sandbox(scheduler => () => {

  const stream = Stream([1, 2, 3, 4]);

  pipe(
    map(() => { throw 42; }),
    jestSubscribe('#')
  )(stream, scheduler);

  scheduler.flush();
}));