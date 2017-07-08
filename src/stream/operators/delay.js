/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Flow } from '../Flow';
import { Sink } from '../Sink';

export default function timeShift(delayTime) {
  return (f, scheduler) => new TimeShiftFlow(delayTime, f, scheduler);
}

class TimeShiftFlow extends Flow {
  constructor(delayTime, stream, scheduler) {
    super(stream, scheduler);
    this.delayTime = delayTime;
  }

  _subscribe(observer) {
    return TimeShiftFlow.sink(this.delayTime, this.scheduler, observer)
      .run(this.stream);
  }

  static sink(delayTime, scheduler, observer) {
    return new TimeShiftSink(delayTime, scheduler, observer);
  }
}

class TimeShiftSink extends Sink {
  constructor(delayTime, scheduler, observer) {
    super();
    this.delayTime = delayTime;
    this.scheduler = scheduler;
    this.observer = observer;
  }

  _next(v) {
    this.scheduler.schedule(
      [this.observer, v],
      this.delayTime,
      ([state, n]) => state.next(n)
    );
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.scheduler.schedule(this.observer, this.delayTime,
      (state) => state.complete()
    )
  }
}