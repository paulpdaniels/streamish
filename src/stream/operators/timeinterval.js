/**
 * Created by paulp on 7/4/2017.
 */

import {ConformantFlow} from '../Flow';
import {ProtectedSink} from "../Sink";

export default function timeInterval() {
  return (flow, scheduler) => new ConformantFlow(new TimeIntervalFlow(flow, scheduler));
}

class TimeIntervalFlow {
  constructor(stream, scheduler) {
    this.stream = stream;
    this.scheduler = scheduler;
  }

  subscribe(observer) {
    return TimeIntervalFlow
      .sink(observer, this.scheduler)
      .run(this.stream);
  }

  static sink(observer, scheduler) {
    return new ProtectedSink(new TimeIntervalSink(observer, scheduler));
  }
}

class TimeIntervalSink {
  constructor(observer, scheduler) {
    this.observer = observer;
    this.scheduler = scheduler;
    this.current = 0;
  }

  next(v) {
    const { current: previous } = this;
    const current = this.current = this.scheduler.now();

    this.observer.next({
      value: v,
      interval: (previous > 0 ? current - previous : 0)
    });
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.complete();
  }
}