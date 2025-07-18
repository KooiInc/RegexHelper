<div align="center">
  <!-- <a href="https://bundlephobia.com/package/jsregexphelper@latest" rel="nofollow"
    ><img src="https://badgen.net/bundlephobia/min/jsregexphelper"></a> 
    20250709: well, this doesn't seem to work anymore
  -->
  <a href="https://www.npmjs.com/package/jsregexphelper"
    ><img src="https://img.shields.io/npm/v/jsregexphelper.svg?labelColor=cb3837&logo=npm&color=dcfdd9"></a>
</div>

> [!IMPORTANT]
> This repository is moved to [Codeberg.org](https://codeberg.org/KooiInc/RegexHelper).
>
> For now it is kept in sync with the original repository @[Github](https://github.com/KooiInc/RegexHelper).
>
> Depending on future USA/Microsoft/Github policies the Github version maybe discontinued later.
>
> In other words, *starting july 12 2025 the Codeberg repository is ***authorative****.

# RegexHelper
A module to create JS regular expressions with comments and whitespace using a 
[tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

**[Demonstration/examples](https://kooiinc.codeberg.page/RegExHelper/Demo/)**.

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
  \/\* ( ?: [^*] | \*+[^*\/] ) *\*+\/ // multiline (/* ... */)
  |                                   // or
  ( ?<!:|\\\|' ) \/\/.*               // single line (// ...)`;

// noCommentRE => /\/\*(?:[^*]|\*+[^*\/])*\*+\/|(?<!:|\\\|')\/\/.*/gm

const cleaned = "Hello world /* no comment */\nHello // no world"
  .replace(noCommentRE.flags(`g`), ``)

// cleaned => Hello world\nHello
```

### escape
The imported function (here `$RE`) has a static `escape` method to escape strings for 
a regular expression. 

It either uses the new (generally available) [RegExp.escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/escape) 
or a proprietary escape method for older browsers.

```javascript
  $RE.escape(`Hello (world)`); // result => 
  // using RegExp.escape: "\x48ello\x20\(world\\)"
  // using proprietary method: "\Hello\x20\(world\)";
```


### flags
A `$RE`-instance is actually a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). 
It can be used as a regular expression, but also contains a `flags` method and a getter (`re`) 
for the actual regular expression value.

The `[$RE instance].re` getter return the actual RegExp instance.

Flags can be added using the instance `flags` method 
`[$RE RegEx instance].flags([flags:string])` 
or (legacy) by adding an Array of flag strings as *last* replacement in the template string
e.g. ```$RE`[ABZ].+ ${["g", "u"]}` ```.

To ***remove*** all current flags, use `[$RE RegEx instance].flags("-r")`.

The `flags` method is chainable. So `[$RE RegEx instance].flags("-r").flags("gm")` 
removes current flags from the instance and re-adds `gm`.

***Replacing*** flags in the instance can be accomplished using the above mentioned (chaining)
or `[$RE RegEx instance].flags("-r|[new flags]")` (so remove current flags `-r`, then 
add `|[new flags]`, e.g. `[$RE RegEx instance].flags(-r|iu`).

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

Or use `$re.escape`
```javascript
const hiRE = $RE`
    Hello${$re.escape(` `)} /* <= this will be \x20 in the result */ {1,} 
    .*`.flags(`gi`);
// hiRE => /Hello\x20{1,}.*/gi

hiRE.test("hello    world!"); // => true
```
