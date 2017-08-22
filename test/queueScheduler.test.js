/**
 * Created by paulp on 7/4/2017.
 */


import {QueueScheduler} from "../src/stream/schedulers/queueScheduler";

test('should schedule individual events', () => {

  const result = [];
  const scheduler = new QueueScheduler();
  const action = (state) => result.push(state);

  scheduler.schedule(0)(action);
  scheduler.schedule(1)(action);
  scheduler.schedule(2)(action);

  expect(result).toEqual([0, 1, 2]);
});

test('should schedule recursively', () => {

  const result = [];
  const scheduler = new QueueScheduler();
  const innerInnerAction = (state) => result.push(state);
  const innerAction = (state, recurse) => {
    recurse.schedule(state + 1)(innerInnerAction);
    result.push(state);
  };

  const action = (state, recurse) => {
    recurse.schedule(state + 1)(innerAction);
    result.push(state);
  };

  scheduler.schedule(0)(action);

  expect(result).toEqual([0, 1, 2]);

});
