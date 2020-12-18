// 放大
const HOOKS =
  [
    'beforeTransform',
    'transform',
    'afterTransform',
    'beforeRender',
    'render',
    'afterRender',
  ]

enum TYPE {
  SYNC,
}

type tapOption = {
  type: TYPE.SYNC;
  name: string;
  stage?: number;
}

type interceptor = {
  register: Function
}

class Hook {
  private args: Array<string>;
  private name: string;
  private intercepts: Array<interceptor> = [];
  private tapOptions: Array<tapOption> = [];

  constructor(args = [], name = '') {
    this.args = args;
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

  call () {
    // throw Error('Function \'call\' should be overridden')
    try {

    }
  }

  tap (option: string | tapOption, fn: Function) {
    const options = this._generateOption(option, fn)
    this._insert(options)
  }

  _generateOption (option: string | tapOption, fn: Function): tapOption {
    if (typeof option === 'string') {
      option = {type: TYPE.SYNC, name: option.trim()}
    } else if (typeof option !== "object" || option === null) {
      throw Error("Invalid tap options");
    }
    if (typeof option.name !== "string" || option.name === "") {
      throw Error("Missing name for tap");
    }
    return Object.assign({ type: TYPE.SYNC, fn }, option);
  }

  _insert(option: tapOption) {

  }

  _callAndHandleErr(tapOption) {
    try {
      tapOption.handler.call(null, )
    } catch (e) {
      throw e
    }
  }
}

