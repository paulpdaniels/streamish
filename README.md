# streamish
A simple Functional Reactive Streaming library

[![CircleCI](https://img.shields.io/circleci/project/github/paulpdaniels/streamish.svg)](https://github.com/paulpdaniels/streamish)

[![Codecov](https://img.shields.io/codecov/c/github/paulpdaniels/streamish.svg)](https://github.com/paulpdaniels/streamish)

## Warning! Work in progress!

This is currently a work in progress and more what I would consider to be an "experiment" than anything else. If you want a production ready system I would suggest checking out RxJS, XStreams, Most.js or Bacon.

If you want to help out and contribute I would greatly appreciate that too.

#### Why another library?

The goal of this project is to be as modular as possible, so to that end I am not following what has become the standard in Reactive Programming libraries and making everything fluent. It is a useful pattern, and in the future I may add a module to do it if it can be done well, but my main goal with this library is both to learn a little more about the topic by creating a library from scratch and to make operators shippable similar to how `lodash` ships.


#### How to use

For now I am only supporting node builds, because that is where this is being primarily tested, but I will be switching to ES6 modules once I get the chance.

Regardless of the style, operators will be imported as modules and composed together.

```javascript
const Stream = require('streamish/Stream');
const map = require('streamish/operators/map');
const subscribe = require('streamish/operators/subscribe');

subscribe(next => console.log('Value: ' + next))(map(a => a * a)(Stream([1, 2, 3, 4])));
```

Now you may be saying to yourself, well that isn't particularly readable, so I'll stick to my fluent operators thank you very much.

But wait there is more!
```javascript

const pipe = require('streamish/operators/pipe');

pipe(
 map(a => a * a),
 subscribe(next => console.log('Value: ' + next)
)(Stream([1, 2, 3, 4]);

```

If that looks familiar to you, Congratulations! You have probably used something like `Ramda` before which is where most of this library got its inspiration, in fact the design of `pipe` and its sibling `compose` are compatible with signatures from Ramda, and hopefully soon the FantasyLand Spec.

#### Why is suscribe an operator too?

Well quite simply because it makes sense. The Streams in this library are meant to be the bare metal requirement that fulfills the TC39 Observable specification, and would technically make them interoperable with other Observable libraries. By packaging `subscribe` as its own operator we can also do some other cool things.

Let's look first at what the standard Stream signature looks like:

```javascript

const subscription = Stream([1, 2, 3, 4]).subscribe({
  next: x => console.log(x),
  error: e => console.log(e),
  complete: () => console.log('Done')
});

```

Using the raw Observable (or `Flow` as we call it in this library) requires a fully functional Observer. Why? Because this lets us build other capabilities on top of it. Basically using the raw form requires that the `Observer` be well formed, because it prevents us from having to do a bunch of other object creation under the covers to make your Observer into a proper Observer. If we allow `subscribe` to exist in its own right, then we can allow library consumers, or other libraries to define the kind of assumptions they want to be able to make about Observers.

Thus we could easily define a "safe" subscribe method which handles various conversion logic and creates a specific type of `Sink`.

```javascript

const subscribe = require('otherLibrary/operators/safeSubscribe');

pipe(
 map(a => a * a),
 subscribe(next => console.log('Value: ' + next)
)(Stream([1, 2, 3, 4]);

```

Notice that we were able to swap the module **in place** because the subscribe is not linked to the `Observable` itself.


#### TODO
- Moar usage instructions, add some examples.
- Marble diagrams?
- Add links





