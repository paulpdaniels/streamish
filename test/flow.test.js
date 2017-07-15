/**
 * Created by paulp on 7/14/2017.
 */

import {Flow} from "../src/stream/Flow";
test('should return a conformant Subscription', () => {

  const mockFn = jest.fn();

  const partiallyConformantStream = {
    subscribe() { return mockFn; }
  };

  const flow = new Flow(partiallyConformantStream);

  const subscription = flow.subscribe();

  subscription.unsubscribe();

  expect(mockFn.mock.calls.length).toBe(1);
});