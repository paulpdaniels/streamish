/**
 * Created by paulp on 7/4/2017.
 */

import { Flow } from '../Flow';
import { FlatMapFlow } from './flatMap';
import _identity from './internal/_identity';
import {Stream} from "../Stream";

export default function concat(...others) {
  return flow => new ConcatFlow([flow, ...others]);
}

class ConcatFlow extends Flow {
  constructor(streams) {
    super();
    this.streams = streams;
  }

  _subscribe(sink) {
    return new FlatMapFlow(_identity, 1, Stream(this.streams))
      .subscribe(sink);
  }
}