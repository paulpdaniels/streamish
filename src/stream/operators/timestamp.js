/**
 * Created by paulp on 7/4/2017.
 */

import { Flow } from '../Flow';
import map from './map';

export default function timestamp() {
  return (flow, scheduler) => new TimeStampFlow(flow, scheduler);
}

class TimeStampFlow extends Flow {
  constructor(flow, scheduler) {
    super(flow);
    this.scheduler = scheduler;
    this._project = (value) => ({value, timestamp: this.scheduler.now()});
  }

  _subscribe(observer) {
    return map(this._project).subscribe(observer);
  }
}