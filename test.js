const { setupProxy, activeTimeouts } = require("./index");

setupProxy();

function runTimeout() {
  setTimeout(() => {
    console.log("Timeout is running");
  }, 200);
}

for (let index = 0; index < 2; index++) {
  runTimeout();
}

console.log(typeof window);
console.log(typeof process);
