/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

'use strict';
import {Stream} from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import flatMap from '../src/stream/operators/flatMap';
import pipe from "../src/stream/operators/pipe";
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";
import {jestSubscribe} from "./helpers/testSubscribe";

test('Can flatMap a stream', sandbox(scheduler => () => {

  let array = [];
  const stream = Stream([3, 4]);

  pipe(
    flatMap(x => Stream([x * 2, x * 3])),
    subscribe(v => array.push(v))
  )(stream);

  expect(array).toEqual([6, 9, 8, 12]);

}));

test('can flatMap an array', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('--a--b');

  pipe(
    flatMap(x => [1, 2, 3]),
    jestSubscribe('--(abc)--(abc)', {a: 1, b: 2, c: 3})
  )(stream, scheduler);

  scheduler.flush();

}));

test('can flatMap a promise', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('--a--b');

  pipe(
    flatMap(x => Promise.resolve(1)),
    jestSubscribe('--a--a', {a: 1})
  )(stream, scheduler);

  scheduler.flush();

}));

test('should halt on error', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('-ab#c|', {a: 1, b: 2, c: 3});

  pipe(
    flatMap(x => Stream([x * 2])),
    jestSubscribe('-ab#', {a: 2, b: 4})
  )(stream, scheduler);

  scheduler.flush();

}));

test('should limit concurrent streams', sandbox(scheduler => () => {


  const {next, complete} = Record;

  const stream = scheduler.createHotStream('-ab-c--------------|', {a: 30, b: 50, c: 60});

  pipe(
    flatMap(x => scheduler.createHotStream(next(x, x), complete(x + 10)), 1),
    jestSubscribe('----a-----b------c-|', {a: 30, b: 50, c: 60})
  )(stream, scheduler);

  scheduler.flush();

}));

test('should forward exceptions from inner streams', sandbox(scheduler => () => {
  const stream = scheduler.createHotStream('abc-------|');

  pipe(
    flatMap(x => scheduler.createHotStream('--#')),
    jestSubscribe('--#')
  )(stream, scheduler);

  scheduler.flush();

}));
