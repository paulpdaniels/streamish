/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";

import {Subscription} from '../Subscription';
import {VirtualTimeScheduler} from "./virtualTimeScheduler";

export class TestScheduler extends VirtualTimeScheduler {
  constructor() {
    super();
  }

  createHotStream(...notifications) {
    return new HotFlow(this, notifications);
  }

  createColdFlow(notifications) {

  }
}

class HotFlow {
  constructor(scheduler, notifications) {
    this.scheduler = scheduler;
    this.notifications = notifications;
  }

  subscribe(sink) {
    const subscription = new Subscription();
    for (let n of this.notifications) {
      subscription.add(this.scheduler.schedule(n.value, n.at, value => value.into(sink)));
    }
    return subscription;
  }
}