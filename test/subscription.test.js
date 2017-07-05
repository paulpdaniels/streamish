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

