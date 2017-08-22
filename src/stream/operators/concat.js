/**
 * Created by paulp on 7/4/2017.
 */

import { FlatMapFlow } from './flatMap';
import _identity from './internal/_identity';
import {Stream} from "../Stream";
import {ConformantFlow} from "../Flow";

export default function concat(...others) {
  return (flow, scheduler) => new ConformantFlow(new FlatMapFlow(Stream([flow, ...others]), _identity, 1, scheduler));
}
