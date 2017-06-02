/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

function _pipe(head, tail) {
  return f => tail.length > 0 ?
    _pipe(tail[0], tail.slice(1))(head(f)) :
    head(f);
}

module.exports = _pipe;