/**
 * Created by paulp on 7/4/2017.
 */

import {ConformantFlow} from '../Flow';
import map from './map';

export default function timestamp() {
  return (flow, scheduler) => new ConformantFlow(new TimeStampFlow(flow, scheduler));
}

class TimeStampFlow {
  constructor(flow, scheduler) {
    this.stream = flow;
    this.scheduler = scheduler;
    this._project = (value) => ({value, timestamp: this.scheduler.now()});
  }

  subscribe(observer) {
    return map(this._project).subscribe(observer);
  }
}