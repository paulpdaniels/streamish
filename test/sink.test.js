/**
 * Created by paulp on 7/14/2017.
 */
import {Sink} from "../src/stream/Sink";
test('should not allow re-entrancy on error', () => {

  const nextFn = jest.fn();
  const errorFn = jest.fn();

  const s = new Sink(nextFn, errorFn);

  s.error(42);
  s.error(42);


  expect(nextFn).toHaveBeenCalledTimes(0);
  expect(errorFn).toHaveBeenCalledTimes(1);

});