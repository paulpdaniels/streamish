/**
 * Created by paulp on 7/4/2017.
 */

import { Subscription } from '../src/stream/Subscription';


test('should only allow a single unsubscribe', () => {
  let value = 0;
  const sub = new Subscription(() => value++);

  sub.unsubscribe();
  sub.unsubscribe();

  expect(value).toBe(1);
});

test('should handle nested Subscriptions', () => {

  const fn = jest.fn();
  const sub = new Subscription(new Subscription(fn));

  sub.unsubscribe();

  expect(fn.mock.calls.length).toBe(1);
});

test('should ignore bad subscriptions', () => {

  const fn = jest.fn();
  const sub = new Subscription('bad subscription', fn);

  sub.unsubscribe();

  expect(fn.mock.calls.length).toBe(1);

});
