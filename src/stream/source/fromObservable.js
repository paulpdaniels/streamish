/**
 * Created by paulp on 7/8/2017.
 */

import getObservable from '../observable/getObservable';

export default function fromObservable(o, scheduler) {
  return Stream(getObservable(o), scheduler);
}