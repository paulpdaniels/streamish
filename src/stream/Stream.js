
'use strict';
import getObservable from "./observable/getObservable";
import fromPromise from "./source/fromPromise";
import fromIterable from "./source/fromIterable";
import fromObservable from "./source/fromObservable";

function isPromiseLike(source) {
  return source && typeof source.then === 'function';
}

function isIterable(source) {
  return (source && typeof source[Symbol.iterator] === 'function');
}

export function Stream(source, scheduler) {
  let obs;
  if ((obs = getObservable(source))) {
    return fromObservable(obs, scheduler);
  } else if (isPromiseLike(source)) {
    return fromPromise(source, scheduler);
  } else if (isIterable(source)) {
    return fromIterable(source, scheduler);
  } else {
    throw new Error(`Warning: Cannot stream type ${typeof source}`);
  }
}