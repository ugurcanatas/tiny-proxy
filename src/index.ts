export namespace TinyProxy {
  export interface Props {
    shouldLog?: boolean;
  }
}

export class TinyProxy {
  private shouldLog?: boolean | undefined;
  private _activeTimeouts: Set<unknown>;
  private _activeIntervals: Set<unknown>;

  constructor(args?: TinyProxy.Props) {
    this._activeTimeouts = new Set();
    this._activeIntervals = new Set();

    this.shouldLog = args?.shouldLog;
  }

  private static log(msg: string, args: unknown, shouldLog?: boolean) {
    if (!shouldLog) {
      return;
    }
    console.log(msg, args);
  }

  public setupTimerProxy() {
    global.setTimeout = new Proxy(global.setTimeout, {
      apply: (target, thisArg, argumentsList) => {
        const id = Reflect.apply<
          typeof setTimeout,
          any[],
          NodeJS.Timeout | number
        >(target, thisArg, argumentsList);
        TinyProxy.log(
          "setTimeout called with:",
          {
            id,
            thisArg,
            argumentsList,
          },
          this.shouldLog
        );
        this._activeTimeouts.add(id);
        return id;
      },
    });

    global.clearTimeout = new Proxy(global.clearTimeout, {
      apply: (target, thisArg, argumentsList) => {
        const id = argumentsList[0];
        TinyProxy.log(
          "clearTimeout called with:",
          {
            id,
            thisArg,
            argumentsList,
          },
          this.shouldLog
        );
        this._activeTimeouts.delete(id);
        return Reflect.apply(target, thisArg, argumentsList);
      },
    });
  }

  public setupIntervalProxy() {
    global.setInterval = new Proxy(global.setInterval, {
      apply: (target, thisArg, argumentsList) => {
        const id = Reflect.apply<
          typeof setInterval,
          any[],
          NodeJS.Timeout | number
        >(target, thisArg, argumentsList);
        TinyProxy.log(
          "setInterval called with:",
          { id, thisArg, argumentsList },
          this.shouldLog
        );
        this._activeIntervals.add(id);
        return id;
      },
    });

    global.clearInterval = new Proxy(global.clearInterval, {
      apply: (target, thisArg, argumentsList) => {
        const id = argumentsList[0];
        TinyProxy.log(
          "clearInterval called with:",
          {
            id,
            thisArg,
            argumentsList,
          },
          this.shouldLog
        );
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
