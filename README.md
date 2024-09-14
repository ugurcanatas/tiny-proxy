## Tiny Proxy

Small Javascript proxy wrapper around `setTimeout`, `clearTimeout`, `setInterval` and `clearInterval`.

### Installation

- Yarn

```bash
yarn add tiny-timer-proxy
```

- NPM

```bash
npm i tiny-timer-proxy
```

### Why?

This tool was developed to monitor and analyze the frequency of timeouts and intervals in a React Native application, helping developers assess their impact on performance.

### Usage

```ts
// Import
import { TinyProxy } from "tiny-timer-proxy";

// Initialize the class
const p = new TinyProxy({ shouldLog: true });

// Call timeout or/and interval setup methods

p.setupTimerProxy(); // timeouts
p.setupIntervalProxy(); // intervals
```

After adding above to somewhere in your application, run your application and you can observe the console logs if `shouldLog` property is set to true.

You should see something like:

```bash
   # ....other logs....
   clearTimeout called with: {"argumentsList": [1074], "id": 1074, "thisArg": undefined}
   clearTimeout called with: {"argumentsList": [1107], "id": 1107, "thisArg": undefined}
   setTimeout called with: {"argumentsList": [[Function anonymous], 5000], "id":
   1125, "thisArg": undefined}
   # ....other logs....
```


Alternatively, you can access the set variables used for storing the related information about the calls by:

```ts
const p = new TinyProxy({ shouldLog: true });

p.setupTimerProxy(); // timeouts

console.log('active timeouts ->', p.activeTimeouts)

```