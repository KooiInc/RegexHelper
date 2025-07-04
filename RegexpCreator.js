export default Object.defineProperties(instanceCreator, {escape: {value: escape4RE, enumerable: true}});

function instanceCreator(regExStr, ...args) {
  const {flags, cleanedArgs} = maybeFlags(...args);
  const initial = createRegExpFromInput(regExStr, ...cleanedArgs);
  return createInstance(new RegExp(initial.split(`\n`).map(line => cleanup(line)).join(``),flags));
}

function createRegExpFromInput(regExStr, ...cleanedArgs) {
  return !hasLength(cleanedArgs) ? regExStr.raw.join(``) :
    regExStr.raw.reduce((a, v, i) => a.concat(cleanedArgs[i - 1] || ``).concat(v), ``);
}

function maybeFlags(...args) {
  const flags = cleanupFlags(getFlags(args.at(-1)));
  return { flags, cleanedArgs: hasLength(flags) ? args.slice(0, -1) : args };
}

function getFlags(maybeFlags) { return isOfType(maybeFlags, Array) ? maybeFlags.join(``) : ``; }

function createInstance(regExp) {
  const instance = new Proxy(Object.defineProperties({}, {
    re: { get() { return regExp; }, enumerable: false },
    toString: {value: () => regExp.toString(), enumerable: false},
    valueOf: {value: () => regExp, enumerable: false},
    flags: { value(flags) {
        regExp = addFlags(flags, regExp);
        return instance; }, enumerable: false },
  }), getterTrap(regExp));
  return instance;
}

function hasLength(variable) { return variable?.length > 0; }

function isOfType(any, CTOR) { return any?.constructor === CTOR; }

function maybeProp(target, key, regExp) {
  const fromRegExp = Reflect.get(regExp, key);
  return {
    fromInstance: Reflect.get(target, key),
    fromRegExpMethod: isOfType(fromRegExp, Function) ? fromRegExp.bind(regExp) : regExp[key]
  }
}

function getterTrap(regExp) {
  return {
    get(target, key) {
      const {fromInstance, fromRegExpMethod} = maybeProp(target, key, regExp);
      switch (true) {
        case !!fromInstance: return fromInstance;
        default: return fromRegExpMethod;
      }
    },
  };
}

function cleanupFlags(flags, currentFlags) {
  currentFlags = (currentFlags ?? ``).replace(/^-r\|/, ``);
  flags = currentFlags.concat(isOfType(flags, String) && hasLength(flags) ? flags : ``);
  return [...new Set([...flags])].join(``).replace(/[^dgimsuvy]/g, ``);
}

function addFlags(flags, re) {
  switch (true) {
    case !isOfType(flags, String): return re;
    case flags.startsWith(`-r|`): return new RegExp(re.source, cleanupFlags(flags));
    case flags === `-r`: return new RegExp(re.source);
    case hasLength(flags): return new RegExp(re.source, cleanupFlags(flags, re.flags));
  }
}

function escape4RE(reString) {
  switch (true) {
    case !!RegExp.escape: return RegExp.escape(reString);
    default:  return (`\\x${reString.at(0)}` +
      reString.slice(1).replace(/\p{S}|\p{P}/gu, a => `\\${a}`))
      .replace(/ |\\x /g, `\\x20`); }
}

function cleanup(str) {
  return str
    .replace(/\/\*(?:[^*]|\*+[^*\/])*\*+\/|(?<!:|\\\|')\/\/.*/g, ``).replace(/\s/g, ``)
    .trim().replace(/<!([^>]\d+)>/g, (a, b) => String.fromCharCode(+b) ?? a);
}
