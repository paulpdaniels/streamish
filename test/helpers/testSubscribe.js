


import {Sink} from "../../src/stream/Sink";
import {Record} from "../../src/stream/operators/notification";
import {withMarbles} from "./withMarbles";

export default function testSubscribe(assertEquals, ...expected) {
  return (flow, scheduler) => new TestSink(expected, scheduler, assertEquals).run(flow);
}

export function withJest(subscriber) {
  return (...input) => {
    return subscriber((actual, expected) => expect(actual).toEqual(expected), ...input);
  }
}

export const jestSubscribe = withMarbles(withJest(testSubscribe));

class TestSink extends Sink {
  constructor(expected, scheduler, assertEquals) {
    super();
    this.expected = expected;
    this.scheduler = scheduler;
    this.actual = [];
    this.assertEquals = assertEquals;
  }

  _next(v) {
    this.actual.push(Record.next(this.scheduler.now(), v));
  }

  _error(e) {
    this.actual.push(Record.error(this.scheduler.now(), e));
  }

  _complete() {
    this.actual.push(Record.complete(this.scheduler.now()));
  }

  _unsubscribe() {
    this.assertEquals(this.actual, this.expected);
  }
}