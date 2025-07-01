export default RegExpFactory();

function RegExpFactory() {
  Object.defineProperties(creator, {
    escape: { value: escape4RE, enumerable: true },
  });
  
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
    const instance = new Proxy(Object.defineProperties({}, {
      re: { get() { return regExp; }, enumerable: false},
      toString: { value: () => regExp.toString(), enumerable: false },
      valueOf: { value: () => regExp, enumerable: false },
      flags: { value(flags) {
          regExp = addFlags(flags, regExp);
          return instance;
        }, enumerable: false },
    }), getterTrap(regExp));
    
    return instance;
  }
  
  function getterTrap(regExp) {
    return {
      get(target, key) {
        const fromTarget = Reflect.get(target, key);
        const fromRE = Reflect.get(regExp, key);
        switch(true) {
          case !!fromTarget: return fromTarget;
          case !!fromRE && fromRE.constructor === Function: return fromRE.bind(target.re);
          default: return target.re[key]
        }
      },
    };
  }
  
  function cleanupFlags(flags, currentFlags) {
    currentFlags = (currentFlags ?? ``).replace(/^\-r\|/, ``);
    flags = currentFlags.concat(flags.constructor === String && flags.length ? flags : ``);
    return [...new Set([...flags])].join(``).replace(/[^dgimsuvy]/g, ``);
  }
  
  function addFlags(flags, re) {
    switch(true) {
      case flags.startsWith(`-r|`): return new RegExp(re.source, cleanupFlags(flags));
      case flags === `-r`: return new RegExp(re.source);
      case flags.constructor === String && flags.length > 0:
        return new RegExp(re.source, cleanupFlags(flags, re.flags));
      default: return re;
    }
  }
  
  function escape4RE(reString) {
    switch(true) {
      case !!RegExp.escape: return RegExp.escape(reString);
      default:
        const first = `\\${reString.at(0)}`;
        return first + reString.slice(1)
          .replace(/\p{S}|\p{P}/gu, a => `\\${a}`);
    }
  }
  
  function cleanup(str) {
    return str
      .replace(/\/\*(?:[^*]|\*+[^*\/])*\*+\/|(?<!:|\\\|')\/\/.*/g, ``)
      .replace(/\s/g, ``)
      .trim()
      .replace(/<!([^>]\d+)>/g, (a, b) => String.fromCharCode(+b) ?? a);
  }
}
