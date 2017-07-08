/**
 * Created by paulp on 7/8/2017.
 */

import fromTimer from "../src/stream/source/fromTimer";
import {sandbox} from "./helpers/sandbox";
import subscribe from "../src/stream/operators/subscribe";

test('should fire the timer after a set amount of time', sandbox(scheduler => () => {

  const result = [];

  const timer = fromTimer(100, scheduler);
  subscribe(x => result.push(x))(timer);

  scheduler.advanceTo(200);

  expect(result).toEqual([0]);

}));

test('should continue emitting events if period is defined', sandbox(scheduler => () => {

  const result = [];
  const timer = fromTimer(0, 10, scheduler);
  subscribe(x => result.push(x))(timer);

  scheduler.advanceTo(50);

  expect(result).toEqual([0, 1, 2, 3, 4, 5]);

}));