/**
 * Created by paulp on 7/8/2017.
 */

import getObservable from '../observable/getObservable';
import {Flow} from '../Flow';

export default function fromObservable(o, scheduler) {
  return new Flow(getObservable(o), scheduler);
}
