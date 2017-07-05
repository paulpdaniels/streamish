
'use strict';
import { Flow } from './Flow';
import { Sink } from './Sink';

function promiseLike(promise) {
  return {
    subscribe(observer) {
      promise
        .then(x => {
          observer.next(x);
          observer.complete();
        })
        .catch(e => observer.error(e));
    }
  };
}

function iterableLike(iterable) {
  return {
    subscribe(observer) {
      for (let item of iterable) {
        try {
          observer.next(item);
        } catch (e) {
          observer.error(e);
        }
      }
      observer.complete();
    }
  }
}

function isStreamLike(source) {
  return source && typeof source.subscribe === 'function';
}

function isPromiseLike(source) {
  return source && typeof source.then === 'function';
}

function isIterable(source) {
  return source && typeof source.length === 'number';
}

function isFunction(source) {
  return typeof source === 'function';
}

export function Stream(source) {
  if (isStreamLike(source)) {
    return from(source);
  } else if (isPromiseLike(source)) {
    return fromPromise(source);
  } else if (isIterable(source)) {
    return fromIterable(source);
  } else if (isFunction(source)) {
    return fromFunction(source);
  } else {
    throw new Error(`Warning: Cannot stream type ${typeof source}`);
  }
}

function from(stream) {
  return new Flow(stream);
}

function fromPromise(promise) {
  return new Flow(promiseLike(promise));
}

function fromIterable(iterable) {
  return new Flow(iterableLike(iterable));
}

function fromFunction(fn) {
  return new Flow({subscribe: fn});
}