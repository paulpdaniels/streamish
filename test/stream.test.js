/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';

import subscribe from '../src/stream/operators/subscribe';
import {Stream} from '../src/stream/Stream';
import * as Rx from 'rxjs';
import * as XStream from 'xstream';

test('Can construct a stream from an array', () => {
  let array = [];
  subscribe(v => array.push(v))(Stream([1, 2, 3, 4]));

  expect(array).toEqual([1, 2, 3, 4]);
});

test('Can construct a stream from a Promise', (done) => {
  let array = [];
  const promise = new Promise(resolve => resolve(42));
  subscribe(v => array.push(v), done, () => {
    expect(array).toEqual([42]);
    done();
  })(Stream(promise));
});

test('should throw on bad stream type', () => {
  expect(() => Stream(42)).toThrow();
});

test('Can convert from RxJS streams', () => {

  const result = [];
  const source = Rx.Observable.of(1, 2, 3, 4);

  const streamish = Stream(source);

  subscribe(
    v => result.push(v)
  )(streamish);

  expect(result).toEqual([1, 2, 3, 4]);

});

test('Can convert from xstream streams', () => {

  const result = [];
  const source = XStream.Stream.of(1, 2, 3, 4);

  const streamish = Stream(source);

  subscribe(
    v => result.push(v)
  )(streamish);

  expect(result).toEqual([1, 2, 3, 4]);

});

test('Can convert to RxJS stream', () => {

  const streamish = Stream([1, 2, 3, 4]);
  const result = [];

  Rx.Observable.from(streamish)
    .subscribe(
      v => result.push(v)
    );

  expect(result).toEqual([1, 2, 3, 4]);

});

// TODO Figure out why this wont pass
xtest('Can convert to XStream stream', () => {
  const streamish = Stream([1, 2, 3, 4]);
  const result = [];

  XStream.Stream.from(streamish)
    .subscribe(
      v => result.push(v)
    );

  expect(result).toEqual([1, 2, 3, 4]);
});