/**
 * Created by paulp on 7/7/2017.
 */


export function sortByDelay({delay: a, index: ia}, {delay: b, index: ib}) {
  if (a === b) {
    if (ia === ib) return 0;
    else return ia < ib ? -1 : 1;
  }
  return a < b ? -1 : 1;
}
