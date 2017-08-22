/**
 * Created by paulp on 7/4/2017.
 */

import {ConformantFlow} from "../Flow";
import {ProtectedSink} from "../Sink";

export default function throttle(timeSpan) {
  return (flow, scheduler) => new ConformantFlow(new ThrottleFlow(flow, timeSpan, scheduler));
}

class ThrottleFlow {
  constructor(stream, timeSpan, scheduler) {
    this.stream = stream;
    this.timeSpan = timeSpan;
    this.scheduler = scheduler;
  }

  subscribe(observer) {
    return ThrottleSink
      .sink(observer, this.timeSpan, this.scheduler)
      .run(this.stream);
  }

  static sink(observer, timeSpan, scheduler) {
    return new ProtectedSink(new ThrottleSink(observer, timeSpan, scheduler));
  }
}


class ThrottleSink {
  constructor(observer, timeSpan, scheduler) {
    this.observer = observer;
    this.timeSpan = timeSpan;
    this.scheduler = scheduler;
    this.sub = null;
    this.lastEmission = -1;
  }

  next(v) {
    const now = this.scheduler.now();
    if (this.lastEmission < 0 || now - this.lastEmission >= this.timeSpan) {
      this.lastEmission = now;
      this.observer.next(v);
    }
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.complete();
  }
}
