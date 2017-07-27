/**
 * Created by paulp on 7/12/2017.
 */

import fromIterable from '../src/stream/source/fromIterable';
import subscribe from '../src/stream/operators/subscribe';
import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";
import {ProtectedSink, Sink} from "../src/stream/Sink";

test('should process an entire iterable without a scheduler', sandbox(scheduler => () => {

  const source = fromIterable(['a', 'b', 'c', 'd']);

  jestSubscribe('(abcd|)')(source, scheduler);

  scheduler.flush();

}));

test('should process an entire iterable with a scheduler', sandbox(scheduler => () => {

  const source = fromIterable(['a', 'b', 'c', 'd'], scheduler);

  jestSubscribe('(abcd|)')(source, scheduler);

  scheduler.flush();

}));

test('should emit an error if next throws', sandbox(scheduler => () => {

  const source = fromIterable(['a', 'b', 'c'], scheduler);
  const errored = jest.fn();
  const e = new Error('Bad time');
  const sink = new Sink(
    () => { throw e },
    errored
  );

  source.subscribe(sink);

  scheduler.flush();

  expect(errored).toBeCalledWith(e);

}));

test('should emit an error if next throws without scheduler', sandbox(() => () => {

  const source = fromIterable(['a', 'b', 'c']);
  const errored = jest.fn();
  const e = new Error('Bad time');
  const sink = new Sink(
    () => { throw e },
    errored
  );

  source.subscribe(sink);

  expect(errored).toBeCalledWith(e);

}));