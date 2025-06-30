<div align="center">
  <a href="https://bundlephobia.com/package/jsregexphelper@latest" rel="nofollow"
    ><img src="https://badgen.net/bundlephobia/min/jsregexphelper"></a>
  <a target="_blank" href="https://www.npmjs.com/package/jsregexphelper"
    ><img src="https://img.shields.io/npm/v/jsregexphelper.svg?labelColor=cb3837&logo=npm&color=dcfdd9"></a>
</div>

# RegexHelper
A module to create JS regular expressions with comments and whitespace using a 
[tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

## Import
```javascript
import $RE from "[location of RegexpCreator.js]";
```

## Syntax
```javascript
const noCommentRE = $RE`
  // -------------------------------------------------------------------
  //  this regular expression finds all comment sections in a JS-string
  // -------------------------------------------------------------------
  \/\*(?:[^*]|\*+[^*\/])*\*+\/ // multiline (/* ... */)
  |                            // or
  (?<!:|\\\|')\/\/.*           // single line (// ...)`;

// noCommentRE => /\/\*(?:[^*]|\*+[^*\/])*\*+\/|(?<!:|\\\|')\/\/.*/gm

const cleaned = "Hello world /* no comment */\nHello // no world"
  .replace(noCommentRE.flags(`g`), ``)

// cleaned => Hello world\nHello
```

### flags
A `$RE`-instance is actually a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). 
It can be used as a regular expression, but also contains a `flags` method and a getter (`re`) 
for the actual regular expression value.

Flags can be added using the instance `flags` method 
`[$RE RegEx instance].flags([flags:string])` 
or by adding an Array of flags as last replacement in the template string
e.g. ```$RE`[ABZ].+ ${["g", "u"]}` ```.

**Notes**
- The replacement value must be the *last* replacement in the template string.
- The given flags are checked and cleaned

### plain spaces
To insert a plain space (so *not* a [whitespace](https://developer.mozilla.org/en-US/docs/Glossary/Whitespace)) use <!32>
```javascript
const hiRE = $RE`
    Hello<!32> /* <= this will be a plain space in the result */ {1,} 
    .*`.flags(`gi`);
// hiRE => /Hello {1,}.*/gi 
const hi = hiRE.test("hello    world!"); 
// hi => true
```

For some examples see this [stackblitz project](https://stackblitz.com/edit/js-zneyk8?file=index.js)
