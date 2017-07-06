/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

// TODO This isn't strictly speaking the correct way to do pipe, probably need to create a new method called "copipe" for this dual
// argument passing
export default function _pipe(head, tail) {
  return (f, s) => tail.length > 0 ?
    _pipe(tail[0], tail.slice(1))(head(f, s), s) :
    head(f, s);
}
