/**
 * Created by paulp on 7/4/2017.
 */

import {Flow} from "../Flow";
import {Sink} from "../Sink";
export default function throttle(timeSpan) {
  return (flow, scheduler) => new ThrottleFlow(flow, timeSpan, scheduler);
}

class ThrottleFlow extends Flow {
  constructor(stream, timeSpan, scheduler) {
    super(stream);
    this.timeSpan = timeSpan;
    this.scheduler = scheduler;
  }

  _subscribe(observer) {
    return ThrottleSink.sink(this.stream, observer, this.timeSpan, this.scheduler);
  }

  static sink(source, observer, timeSpan, scheduler) {
    return new ThrottleSink(observer, timeSpan, scheduler)
      .run(source);
  }
}


class ThrottleSink extends Sink {
  constructor(observer, timeSpan, scheduler) {
    super();
    this.observer = observer;
    this.timeSpan = timeSpan;
    this.scheduler = scheduler;
    this.sub = null;
    this.lastEmission = -1;
  }

  run(source) {
    return this.sub = source.subscribe(this);
  }

  _next(v) {
    const now = this.scheduler.now();
    if (this.lastEmission < 0 || now - this.lastEmission >= this.timeSpan) {
      this.lastEmission = now;
      this.observer.next(v);
    }
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.complete();
  }

  unsubscribe() {
    this.sub && this.sub.unsubscribe();
  }
}
