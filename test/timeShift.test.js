/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

'use strict';
import timeShift from '../src/stream/operators/delay';
import {sandbox} from './helpers/sandbox';
import pipe from "../src/stream/operators/pipe";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should delay emission of events', sandbox(scheduler => () => {

  const source = scheduler.createHotStream('--a-b--c|');

  pipe(
    timeShift(10),
    jestSubscribe('---a-b--c|')
  )(source, scheduler);

  scheduler.flush();
}));

test('should forward errors immediately', sandbox(scheduler => () => {

  const stream = scheduler.createHotStream('-ab#c|');

  pipe(
    timeShift(10),
    jestSubscribe('--a#')
  )(stream, scheduler);

  scheduler.flush();

}));