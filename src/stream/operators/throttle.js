/**
 * Created by paulp on 7/4/2017.
 */

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


class ThrottleSink {
  constructor(observer, timeSpan, scheduler) {
    this.observer = observer;
    this.timeSpan = timeSpan;
    this.scheduler = scheduler;
    this.sub = null;
    this.lastEmission = -1;
  }

  run(source) {
    return this.sub = source.subscribe(this);
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
    this.unsubscribe();
  }

  complete() {
    this.observer.complete();
    this.unsubscribe();
  }

  unsubscribe() {
    this.sub && this.sub.unsubscribe();
  }
}
