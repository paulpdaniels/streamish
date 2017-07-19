
import { Record } from "../../src/stream/operators/notification";

export function withMarbles(subscriber) {
  return (head, ...rest) => {
    let expected;
    if (typeof head === 'string') {
      expected = parseMarbles(head, ...rest);
    } else {
      expected = [head, ...rest];
    }
    return subscriber(...expected);
  }
}

function parseMarbles(marbles, mapMarblesToObject, mapMarblesToException) {
  let currentTime = 0;
  let suspended = false;
  const expected = [];
  for (let marble of marbles) {
    switch (marble) {
      case '-':
      case ' ':
        currentTime += 10;
        break;
      case '(':
        if (suspended) throw new Error('Invalid marble can\'t have nested parenthesis');
        suspended = true;
        break;
      case ')':
        if (!suspended) throw new Error('Unmatched \')\' detected!');
        suspended = false;
        currentTime += 10;
        break;
      case '#':
        expected.push(Record.error(currentTime, mapMarblesToException || 42));
        !suspended && (currentTime += 10);
        break;
      case '|':
        expected.push(Record.complete(currentTime));
        !suspended && (currentTime += 10);
        break;
      default:
        expected.push(Record.next(currentTime,
          mapMarblesToObject && typeof mapMarblesToObject[marble] !== 'undefined' ?
            mapMarblesToObject[marble] : marble
        ));
        !suspended && (currentTime += 10);
    }
  }

  return expected;
}