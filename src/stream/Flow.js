/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

import { Subscription } from './Subscription';

export class Flow {
  constructor(stream, scheduler) {
    this.stream = stream;
    this.scheduler = scheduler;
  }

  subscribe(observer) {
    const sub = this._subscribe(observer);
    return sub ? Flow._conform(sub) : Subscription.empty;
  }

  static _conform(sub) {
    if (sub && sub.unsubscribe) {
      return sub;
    } else {
      return new Subscription(sub);
    }
  }

  _subscribe(sink) {
    return this.stream.subscribe(sink);
  }
}