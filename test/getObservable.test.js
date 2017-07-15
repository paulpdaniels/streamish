/**
 * Created by paulp on 7/12/2017.
 */

import getObservable from '../src/stream/observable/getObservable';
import symbolObservable from 'symbol-observable'

test('returns null on unrecognized type', () => {
  expect(getObservable(null)).toBeFalsy();
});

test('throws for bad observables', () => {

  const badObservable = {
    [symbolObservable]() {
      return 'Muahhahahaaha';
    }
  };

  expect(() => getObservable(badObservable)).toThrow();

});
