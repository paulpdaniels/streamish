/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

const Sink = require('../Sink');

function noop() {
}

function subscribe(next, error, complete) {
  return flow => flow.subscribe(_conform(next, error, complete))
}

function _conform(observerOrNext, error, complete) {
  const _next = (observerOrNext && observerOrNext.next) || observerOrNext || noop;
  const _complete = (observerOrNext && observerOrNext.complete) || complete || noop;
  // TODO don't swallow errors by default
  const _error = (observerOrNext && observerOrNext.error) || error || noop;

  let context = !!(observerOrNext && observerOrNext.next) ? observerOrNext : null;

  return new Sink(_next, _error, _complete, context);
}

module.exports = subscribe;