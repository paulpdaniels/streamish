/**
 * Created by paulp on 7/8/2017.
 */

import {ConformantFlow} from '../Flow';

export default function fromPromise(p, scheduler) {
  return new ConformantFlow(new PromiseSource(p, scheduler));
}

class PromiseSource {
  constructor(p, scheduler) {
    // TODO Support promise cancellation
    this.promise = p;
    this.scheduler = scheduler;
  }

  static dispatchValue([sink, value]) {
    sink.next(value);
    sink.complete();
  }

  static dispatchError([sink, error]) {
    sink.error(error);
  }

  subscribe(sink) {
    this.promise.then(
      value => {
        if (this.scheduler) {
          this.scheduler.schedule([sink,value], 0, PromiseSource.dispatchValue);
        } else {
          PromiseSource.dispatchValue([sink, value]);
        }
      },
      error => {
        if (this.scheduler) {
          this.scheduler.schedule([sink, error], 0, PromiseSource.dispatchError);
        } else {
          PromiseSource.dispatchError([sink, error]);
        }

      }
    )
  }
}