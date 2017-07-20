/**
 * Created by paulp on 7/8/2017.
 */

import {Subscription} from '../Subscription';
import { Flow } from '../Flow';

export default function fromTimer(initialDelay, periodOrScheduler, scheduler) {
  return new TimerSource(initialDelay, periodOrScheduler, scheduler);
}

class TimerSource extends Flow {
  constructor(initialDelay, periodOrScheduler, scheduler) {
    super();
    this.initialDelay = initialDelay;
    if (scheduler) {
      this.period = periodOrScheduler;
      this.scheduler = scheduler;
    } else if (periodOrScheduler) {
      this.scheduler = periodOrScheduler;
      this.period = -1;
    } else {
      throw new Error('Could not build timer source!');
    }
  }

  static dispatch([observer, index, period], scheduler) {
    observer.next(index);
    if (period > 0) {
      return scheduler.schedule([observer, index + 1, period], period, TimerSource.dispatch)
    } else {
      observer.complete();
    }
    return Subscription.empty;
  }

  _subscribe(observer) {
    return this.scheduler.schedule([observer, 0, this.period], this.initialDelay, TimerSource.dispatch);
  }
}