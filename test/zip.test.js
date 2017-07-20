/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

'use strict';
import {Stream} from '../src/stream/Stream';
import subscribe from '../src/stream/operators/subscribe';
import zip from '../src/stream/operators/zip';
import {sandbox} from "./helpers/sandbox";
import {Record} from "../src/stream/operators/notification";
import pipe from "../src/stream/operators/pipe";
import {jestSubscribe} from "./helpers/testSubscribe";


test('Can zip streams', sandbox(scheduler => () => {

  const stream1 = scheduler.createHotStream('abcd|');
  const stream2 = scheduler.createHotStream('efgh|');

  pipe(
    zip((x, y) => x + y, stream2),
    jestSubscribe('abcd|', {a: 'ae', b: 'bf', c: 'cg', d: 'dh'})
  )(stream1, scheduler);

  scheduler.flush();
}));

test('should forward errors from primary stream', sandbox(scheduler => () => {

  const primary = scheduler.createHotStream('--a--#');
  const secondary = scheduler.createHotStream('-ab');

  jestSubscribe('--a--#', {a: 'aa'})(
    zip((x, y) => x + y, secondary)(primary, scheduler),
    scheduler
  );

  scheduler.flush();
}));

test('should forward errors from secondary stream', sandbox(scheduler => () => {

  const primary = scheduler.createHotStream('--a--#');
  const secondary = scheduler.createHotStream('-ab');

  pipe(
    zip((x, y) => x + y, primary),
    jestSubscribe('--a--#', {a: 'aa'})
  )(secondary, scheduler);

  scheduler.flush();

}));

test('should forward exceptions from selector', sandbox(scheduler => () => {

  const primary = Stream([1, 2, 3]);
  const secondary = Stream([1 ,2 ,3]);

  pipe(
    zip(() => { throw 42; }, secondary),
    jestSubscribe('#')
  )(primary, scheduler);

  scheduler.flush();

}));