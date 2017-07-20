/**
 * Created by paulp on 7/12/2017.
 */

import fromIterable from '../src/stream/source/fromIterable';
import subscribe from '../src/stream/operators/subscribe';
import {sandbox} from "./helpers/sandbox";
import {jestSubscribe} from "./helpers/testSubscribe";

test('should process an entire iterable without a scheduler', sandbox(scheduler => () => {

  const source = fromIterable(['a', 'b', 'c', 'd']);

  jestSubscribe('(abcd|)')(source, scheduler);

  scheduler.flush();

}));

test('should process an entire iterable with a scheduler', sandbox(scheduler => () => {

  const source = fromIterable(['a', 'b', 'c', 'd'], scheduler);

  jestSubscribe('(abcd|)')(source, scheduler);

  scheduler.flush();

}));