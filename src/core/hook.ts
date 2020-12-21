enum TYPE {
  SYNC,
}

type tapOption = {
  name: string;
  type?: TYPE.SYNC;
  // The higher the value, the higher the execution priority
  stage?: number;
  // Postposition list
  before?: Array<string> | string | null;
  fn?: Function;
}

type interceptor = {
  register?: (tapOption) => tapOption,
  done?: Function,
  error?: (e: Error) => void,
  call?: Function,
}

/**
 * reference resources:
 * https://github.com/webpack/tapable/blob/master/lib/Hook.js
 */
class Hook {
  private name: string;
  private intercepts: Array<interceptor> = [];
  private tapOptions: Array<tapOption> = [];

  constructor(name = '') {
    this.name = name;
  }

  intercept(interceptor: interceptor) {
    // options
    this.intercepts.push(Object.assign({}, interceptor))
    if (interceptor.register) {
      for (let i = 0; i < this.tapOptions.length; i++) {
        this.tapOptions[i] = interceptor.register(this.tapOptions[i]);
      }
    }
  }

  call (...args) {
    this._callInterceptor(args, 'call')
    for (let option of this.tapOptions) {
      this._callAndHandleErr(option.fn, args, true)
    }
    this._callInterceptor(args, 'done')
  }

  tap (option: string | tapOption, fn: Function) {
    option = this._generateOption(option, fn)
    option = this._insert(option)
    this._callInterceptor([ option ], 'register')
  }

  _generateOption (option: string | tapOption, fn: Function): tapOption {
    if (typeof option === 'string') {
      option = { type: TYPE.SYNC, name: option.trim() }
    } else if (typeof option !== "object" || option === null) {
      throw Error("Invalid tap options");
    }
    if (typeof option.name !== "string" || option.name === "") {
      throw Error("Missing name for tap");
    }
    option.before =
      typeof option.before === 'string'
        ? option.before.split(',')
        : Array.isArray(option.before)
          ? option.before
          : [];
    option.stage =
      typeof option.stage === "number"
        ? option.stage
        : 0;
    return Object.assign({ type: TYPE.SYNC, fn }, option);
  }

  _insert(option: tapOption) {
    let i = this.tapOptions.length;
    let before = new Set(option.before);
    let stage = option.stage;
    while (i) {
      i--;
      const item = this.tapOptions[i];
      this.tapOptions[i + 1] = item;
      if (before.has(item.name)) {
        before.delete(item.name)
        continue
      }
      if (before.size || item.stage < stage) {
        continue
      }
      i++;
      break
    }
    option.before = null
    return (this.tapOptions[i] = option);
  }

  _callAndHandleErr(fn, args, isCall: boolean) {
    try {
      fn.apply(null, args)
    } catch (e) {
      isCall && this._callInterceptor([ e ], 'error')
      throw e
    }
  }

  _callInterceptor(args: Array<tapOption>, fnName) {
    for (let intercept of this.intercepts) {
      intercept[fnName] && this._callAndHandleErr(intercept[fnName], args, false)
    }
  }

}

export default Hook
