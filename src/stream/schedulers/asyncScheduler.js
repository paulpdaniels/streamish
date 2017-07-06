/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import {Subscription} from '../Subscription';

function timeoutAdapter(root, scheduler) {
  const {setTimeout, clearTimeout} = root;

  return function (state, delayTime, action) {
    const timeoutId = setTimeout.call(root, (state, scheduler) => action(state, scheduler), delayTime, state, scheduler);
    return new Subscription(() => clearTimeout.call(root, timeoutId));
  }
}

export class AsyncScheduler {
  constructor(root) {
    this._schedule = timeoutAdapter(root, this);
  }

  schedule(state, delayTime, action) {
    return this._schedule(state, delayTime, action);
  }
}