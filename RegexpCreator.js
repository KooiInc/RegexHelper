export default (regexStr, ...args) => {
    const flags = Array.isArray(args.slice(-1)) ? args.pop().join('') : ``;
    
    return new RegExp(
      (args.length &&
        regexStr.raw.reduce( (a, v, i ) => a.concat(args[i-1] || ``).concat(v), ``) || 
        regexStr.raw.join(``))
        .split(`\n`)
        .map( line => line.replace(/\s|\/\/.*$/g, ``).trim().replace(/@s/g, ` `) )
        .join(``), flags.length ? flags.join(``) : flags );
  }
