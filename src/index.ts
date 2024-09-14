export type Logger = keyof Pick<Console, "log" | "error" | "warn">;

export class TinyProxy {
  private logLevel?: Logger;
  private _activeTimeouts: Set<unknown>;
  private _activeIntervals: Set<unknown>;

  constructor({ logLevel }: { logLevel?: Logger } = { logLevel: undefined }) {
    this._activeTimeouts = new Set();
    this._activeIntervals = new Set();
    if (!!logLevel) {
      this.logLevel = logLevel;
    }
  }

  private static getLogger(logger?: Logger) {
    if (!logger) {
      return;
    }
    return console[logger];
  }

  public setupTimerProxy() {
    const logger = TinyProxy.getLogger(this.logLevel);

    global.setTimeout = new Proxy(global.setTimeout, {
      apply: (target, thisArg, argumentsList) => {
        const id = Reflect.apply<
          typeof setTimeout,
          any[],
          NodeJS.Timeout | number
        >(target, thisArg, argumentsList);
        logger?.("setTimeout called with:", { id, thisArg, argumentsList });
        this._activeTimeouts.add(id);
        return id;
      },
    });

    global.clearTimeout = new Proxy(global.clearTimeout, {
      apply: (target, thisArg, argumentsList) => {
        const id = argumentsList[0];
        logger?.("clearTimeout called with:", {
          id,
          thisArg,
          argumentsList,
        });
        this._activeTimeouts.delete(id);
        return Reflect.apply(target, thisArg, argumentsList);
      },
    });
  }

  public setupIntervalProxy() {
    const logger = TinyProxy.getLogger(this.logLevel);

    global.setInterval = new Proxy(global.setInterval, {
      apply: (target, thisArg, argumentsList) => {
        const id = Reflect.apply<
          typeof setInterval,
          any[],
          NodeJS.Timeout | number
        >(target, thisArg, argumentsList);
        logger?.("setInterval called with:", { id, thisArg, argumentsList });
        this._activeIntervals.add(id);
        return id;
      },
    });

    global.clearInterval = new Proxy(global.clearInterval, {
      apply: (target, thisArg, argumentsList) => {
        const id = argumentsList[0];
        logger?.("clearInterval called with:", {
          id,
          thisArg,
          argumentsList,
        });
        this._activeIntervals.delete(id);
        return Reflect.apply(target, thisArg, argumentsList);
      },
    });
  }

  public get activeTimeouts() {
    return this._activeTimeouts;
  }

  public get activeIntervals() {
    return this._activeIntervals;
  }
}
