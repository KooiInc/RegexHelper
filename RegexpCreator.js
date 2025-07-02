Object.defineProperties(instanceCreator, {escape: {value: escape4RE, enumerable: true}});

export default instanceCreator;

function instanceCreator(regExStr, ...args) {
  const {flags, cleanArgs} = maybeFlags(...args);
  const initial = createIRegExpFromInput(regExStr, ...cleanArgs);

  return createInstance(new RegExp(
    initial.split(`\n`).map(line => cleanup(line)).join(``),
    flags
  ));
}

function createIRegExpFromInput(regExStr, ...cleanArgs) {
  return cleanArgs.length > 0
    ? regExStr.raw.reduce((a, v, i) => a.concat(cleanArgs[i - 1] || ``).concat(v), ``)
    : regExStr.raw.join(``);
}

function maybeFlags(...args) {
  const flags = cleanupFlags(getFlags(args.at(-1)));
  return { flags, cleanArgs: flags.length > 0 ? args.slice(0, -1) : args };
}

function getFlags(maybeFlags) {
  return Array.isArray(maybeFlags) ? maybeFlags.join(``) : ``;
}

function createInstance(regExp) {
  const instance = new Proxy(Object.defineProperties({}, {
    re: {
      get() {
        return regExp;
      }, enumerable: false
    },
    toString: {value: () => regExp.toString(), enumerable: false},
    valueOf: {value: () => regExp, enumerable: false},
    flags: {
      value(flags) {
        regExp = addFlags(flags, regExp);
        return instance;
      }, enumerable: false
    },
  }), getterTrap(regExp));
  
  return instance;
}

function maybeProp(target, key, regExp) {
  return {fromTarget: Reflect.get(target, key), fromInstance: Reflect.get(regExp, key)}
}

function getterTrap(regExp) {
  return {
    get(target, key) {
      const {fromTarget, fromInstance} = maybeProp(target, key, regExp);
      
      switch (true) {
        case !!fromTarget: return fromTarget;
        case !!fromInstance && fromInstance.constructor === Function: return fromInstance.bind(target.re);
        default: return regExp[key];
      }
    },
  };
}

function cleanupFlags(flags, currentFlags) {
  currentFlags = (currentFlags ?? ``).replace(/^-r\|/, ``);
  flags = currentFlags.concat(flags.constructor === String && flags.length ? flags : ``);
  return [...new Set([...flags])].join(``).replace(/[^dgimsuvy]/g, ``);
}

function addFlags(flags, re) {
  switch (true) {
    case flags.startsWith(`-r|`): return new RegExp(re.source, cleanupFlags(flags));
    case flags === `-r`: return new RegExp(re.source);
    case flags.constructor === String && flags.length > 0: return new RegExp(re.source, cleanupFlags(flags, re.flags));
    default: return re;
  }
}

function escape4RE(reString) {
  switch (true) {
    case !!RegExp.escape: return RegExp.escape(reString);
    default:
      const first = `\\${reString.at(0)}`;
      return first + reString.slice(1)
        .replace(/\p{S}|\p{P}/gu, a => `\\${a}`)
        .replace(/ /g, `\\x20`);
  }
}

function cleanup(str) {
  return str
    .replace(/\/\*(?:[^*]|\*+[^*\/])*\*+\/|(?<!:|\\\|')\/\/.*/g, ``)
    .replace(/\s/g, ``)
    .trim()
    .replace(/<!([^>]\d+)>/g, (a, b) => String.fromCharCode(+b) ?? a);
}
