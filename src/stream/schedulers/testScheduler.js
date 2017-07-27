/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */


"use strict";

import {Subscription} from '../Subscription';
import {VirtualTimeScheduler} from "./virtualTimeScheduler";
import {withMarbles} from "../../../test/helpers/withMarbles";
import {ConformantFlow} from "../Flow";

export class TestScheduler extends VirtualTimeScheduler {
  constructor() {
    super();
  }

  createHotStream(...notifications) {
    return withMarbles((...input) => TestScheduler.constructHotStream(this, input))(...notifications);
  }

  createColdStream(...notifications) {
    return withMarbles((...input) => TestScheduler.constructColdStream(this, input))(...notifications);
  }

  static constructHotStream(scheduler, notifications) {
    return new ConformantFlow(new HotFlow(scheduler, notifications));
  }

  static constructColdStream(scheduler, notifications) {
    return new ConformantFlow(new ColdFlow(scheduler, notifications));
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

class ColdFlow {
  constructor(scheduler, notifications) {
    this.scheduler = scheduler;
    this.notifications = notifications;
  }

  subscribe(sink) {
    const subscription = new Subscription();
    for (let n of this.notifications) {
      subscription.add(this.scheduler.schedule(n.value, n.at + this.scheduler.now(), value => value.into(sink)));
    }
  }
}