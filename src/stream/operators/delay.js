/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */


'use strict';
import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';

export default function timeShift(delayTime) {
  return (f, scheduler) => new ConformantFlow(new TimeShiftFlow(f, delayTime, scheduler));
}

class TimeShiftFlow {
  constructor(stream, delayTime, scheduler) {
    this.scheduler = scheduler;
    this.stream = stream;
    this.delayTime = delayTime;
  }

  subscribe(observer) {
    return TimeShiftFlow
      .sink(this.delayTime, this.scheduler, observer)
      .run(this.stream);
  }

  static sink(delayTime, scheduler, observer) {
    return new ProtectedSink(new TimeShiftSink(delayTime, scheduler, observer));
  }
}

class TimeShiftSink {
  constructor(delayTime, scheduler, observer) {
    this.delayTime = delayTime;
    this.scheduler = scheduler;
    this.observer = observer;
  }

  next(v) {
    // TODO Add error handling
    this.scheduler.schedule(
      [this.observer, v],
      this.delayTime,
      ([state, n]) => state.next(n)
    );
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.scheduler.schedule(this.observer, this.delayTime,
      (state) => state.complete()
    )
  }
}