/**
 * Created by paulp on 7/4/2017.
 */

import { FlatMapFlow } from './flatMap';
import _identity from './internal/_identity';
import {Stream} from "../Stream";

export default function concat(...others) {
  return (flow, scheduler) => new FlatMapFlow(_identity, 1, Stream([flow, ...others]), scheduler);
}
