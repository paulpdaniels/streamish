
'use strict';
import { Flow } from './Flow';
import getObservable from "./observable/getObservable";
import fromPromise from "./source/fromPromise";
import fromIterable from "./source/fromIterable";

function isPromiseLike(source) {
  return source && typeof source.then === 'function';
}

function isIterable(source) {
  return (source && typeof source[Symbol.iterator] === 'function');
}

export function Stream(source, scheduler) {
  let obs;
  if ((obs = getObservable(source))) {
    return new Flow(obs, scheduler);
  } else if (isPromiseLike(source)) {
    return fromPromise(source, scheduler);
  } else if (isIterable(source)) {
    return fromIterable(source, scheduler);
  } else {
    throw new Error(`Warning: Cannot stream type ${typeof source}`);
  }
}