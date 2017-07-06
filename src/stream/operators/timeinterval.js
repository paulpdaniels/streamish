/**
 * Created by paulp on 7/4/2017.
 */

import { Flow } from '../Flow';

export default function timeInterval() {
  return (flow, scheduler) => new TimeIntervalFlow(flow, scheduler);
}

class TimeIntervalFlow extends Flow {
  constructor(stream, scheduler) {
    super(stream);
    this.scheduler = scheduler;
  }

  _subscribe(observer) {
    return this.stream.subscribe(TimeIntervalFlow.sink(observer, this.scheduler));
  }

  static sink(observer, scheduler) {
    return new TimeIntervalSink(observer, scheduler);
  }
}

class TimeIntervalSink {
  constructor(observer, scheduler) {
    this.observer = observer;
    this.scheduler = scheduler;
    this.current = 0;
    this.sub = null;
    this.isStopped = false;
  }

  run(source) {
    return this.sub = source.subscribe(this);
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