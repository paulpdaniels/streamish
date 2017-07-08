/**
 * Created by paulp on 7/8/2017.
 */

import fromPromise from "../src/stream/source/fromPromise";
import {sandbox} from "./helpers/sandbox";
import subscribe from "../src/stream/operators/subscribe";

test('should forward a value from a promise completion', sandbox(scheduler => async () => {
  expect.assertions(2);

  const p = Promise.resolve(42);

  const promise$ = fromPromise(p, scheduler);

  subscribe(x => {
    expect(x).toBe(42);
  })(promise$);

  await expect(p).resolves.toBe(42);

  scheduler.advanceTo(10);

}));

test('should forward an error from a promise', sandbox(scheduler => async () => {
  expect.assertions(2);
  const p = Promise.reject(42);
  const promise$ = fromPromise(p, scheduler);

  subscribe(x => {
    fail('Should not have emitted value!');
  }, e => {
    expect(e).toBe(42);
  })(promise$);

  await expect(p).rejects.toBe(42);

  scheduler.advanceTo(10);
}));