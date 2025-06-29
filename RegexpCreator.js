export default RegExpFactory();

function RegExpFactory() {
  return creator;
  
  function creator(regExStr, ...args) {
    const lastFlag = args.at(-1);
    const flags = Array.isArray(lastFlag) ? lastFlag.join(``) : ``;
    args = flags.length > 0 ? args.slice(0, -1) : args;
    
    const initial = args.length > 0
      ? regExStr.raw.reduce( (a, v, i ) => a.concat(args[i-1] || ``).concat(v), ``)
      : regExStr.raw.join(``);
    const regExp = new RegExp(
      initial.split(`\n`).map( line => cleanup(line) ).join(``),
      cleanupFlags(flags)
    );
    
    return createInstance(regExp);
  }
  
  function createInstance(regExp) {
    const getTrap = {
      get(target, key) {
        return Reflect.get(target, key) ?? Reflect.get(regExp, key)?.bind(regExp);
      },
    };
    
    const instance = new Proxy(Object.defineProperties({}, {
      re: { get() { return regExp; }, enumerable: false},
      toString: { value: () => regExp.toString(), enumerable: false },
      valueOf: { value: () => regExp, enumerable: false },
      flags: { value(flags) {
          regExp = addFlags(flags, regExp);
          return instance;
        }, enumerable: false },
    }), getTrap);
    
    return instance;
  }
  
  function cleanupFlags(flags) {
    return flags.constructor === String && flags.length
      ? flags.replace(/[^dgimsuvy]/g, ``)
      : ``;
  }
  
  function addFlags(flags, re) {
    if (flags.constructor === String && flags.length > 0) {
      return new RegExp(re.source, re.flags + cleanupFlags(flags));
    }
    return re;
  }
  
  function cleanup(str) {
    return str
      .replace(/\/\*(?:[^*]|\*+[^*\/])*\*+\/|(?<!:|\\\|')\/\/.*/g, ``)
      .replace(/\s/g, ``)
      .trim()
      .replace(/<!([^>]\d+)>/g, (a, b) => String.fromCharCode(+b) ?? a);
  }
}
