const activeTimeouts = new Set();
const activeIntervals = new Set();

// Proxy for setTimeout & clearTimeout
function setupTimeoutProxy() {
  setTimeout = new Proxy(setTimeout, {
    apply(target, thisArg, argumentsList) {
      const id = Reflect.apply(target, thisArg, argumentsList);
      console.log("setTimeout called with:", { id, thisArg, argumentsList });
      activeTimeouts.add(id);
      return id;
    },
  });

  clearTimeout = new Proxy(clearTimeout, {
    apply(target, thisArg, argumentsList) {
      const id = argumentsList[0];
      console.log("clearTimeout called with:", { id, thisArg, argumentsList });
      activeTimeouts.delete(id);
      return Reflect.apply(target, thisArg, argumentsList);
    },
  });
}

// Proxy for setInterval & clearInterval
function setupIntervalProxy() {
  setInterval = new Proxy(setInterval, {
    apply(target, thisArg, argumentsList) {
      const id = Reflect.apply(target, thisArg, argumentsList);
      console.log("setInterval called with:", { id, thisArg, argumentsList });
      activeIntervals.add(id);
      return id;
    },
  });

  clearInterval = new Proxy(clearInterval, {
    apply(target, thisArg, argumentsList) {
      const id = argumentsList[0];
      console.log("clearInterval called with:", { id, thisArg, argumentsList });
      activeIntervals.delete(id);
      return Reflect.apply(target, thisArg, argumentsList);
    },
  });
}

function setupProxy() {
  setupTimeoutProxy();
  setupIntervalProxy();
}

exports.activeTimeouts = activeTimeouts;
exports.activeIntervals = activeIntervals;
exports.setupProxy = setupProxy;
