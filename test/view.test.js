

import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";
import view from "../src/stream/operators/view";
import pipe from "../src/stream/operators/pipe";

test('should only forward the selected property', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('--a---b', {a: {a: 10}, b: {a: 20}});

  pipe(
    view('a'),
    jestSubscribe('--a--b', {a: 10, b: 20})
  )(stream, scheduler);

  scheduler.flush();

}));

test('should return undefined if the path is non-existent', sandbox(scheduler => () => {
  const stream = scheduler.createHotStream('--a--b');

  pipe(
    view('a'),
    jestSubscribe('--a--b', {a: undefined, b: undefined})
  )(stream, scheduler);

  scheduler.flush();
}));

test('should forward exceptions downstream', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('--a--#--b');

  pipe(
    view('a'),
    jestSubscribe('--a--#', {a: undefined})
  )(stream, scheduler);

  scheduler.flush();

}));

test('should handle multiple paths', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('--a--b', {a: {a: {b: 1}}, b: {a: {b: 2}}});

  pipe(
    view('a', 'b'),
    jestSubscribe('--a--b', {a: 1, b: 2})
  )(stream, scheduler);

  scheduler.flush();
}));

test('should handle mixed paths', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('--a--b', {a: [{b: 1}], b: [{b: 2}]});

  pipe(
    view(0, 'b'),
    jestSubscribe('--a--b', {a: 1, b: 2})
  )(stream, scheduler);

  scheduler.flush();

}));