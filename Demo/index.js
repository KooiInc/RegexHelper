const {$, logFactory} = (await import("https://unpkg.com/stackblitzhelpers@latest/index.browser.bundled.js"));
import $re from "../RegexpCreator.js";
import style from "./DynamicStyling.js";
const exampleCode = await fetchTemplates($);
const results = {};
const {log: print} = logFactory(true);

header();
demo();

function demo() {
  print(exampleCode.re01.codeblock, exampleCode.re01.result);
  print(exampleCode.re02.codeblock, exampleCode.re02.result);
  print(exampleCode.re03.codeblock, exampleCode.re03.result);
  print(exampleCode.re04.codeblock, exampleCode.re04.result);
  print(exampleCode.re05.codeblock, exampleCode.re05.result);
  print(exampleCode.re06.codeblock, exampleCode.re06.result);
  print(exampleCode.re07.codeblock, exampleCode.re07.result);
  print(exampleCode.re08.codeblock, exampleCode.re08.result);
  print(exampleCode.re09.codeblock, exampleCode.re09.result);
  print(exampleCode.re10.codeblock, exampleCode.re10.result);
  
  hljs.highlightAll(`javascript`);
}

async function fetchTemplates($) {
  $.allowTag(`template`);
  return getCodeblocks(
    $.div(
      await fetch("./codeblocks.html")
        .then(r => r.text()) ) );
}

function getCodeblocks(templates) {
  const exampleBlocks = templates.find(`template[id]`);
  const codeResults = retrieveCodeResults();
  
  return [...exampleBlocks].reduce( (acc, block) => {
    return {
      ...acc,
      [block.id]: {
        codeblock: `<pre class="codebox"><code class="hljs language-javascript">${
          block.content.textContent.trim()}</code></pre>`,
        result: stringifyRE4Display(codeResults[block.id]),
      }
    };
  }, {});
}

function retrieveCodeResults() {
  const hello = `hello`;
  return {
    re01: $re`
      /* -----------------------------------------------------------------------------------
          Used for cleanup of a stringified Function (/w spaces already removed).
          Used in https://stackblitz.com/edit/web-platform-jaxz82?file=CountArgumentsLib.js
       * ----------------------------------------------------------------------------------- */
        ( ^[a-z_]( ?= ( =>|=>{ ) ) )                       /* letter or underscore followed by
                                                              '=>' and/or '{' */
        | ( ^\([^)].+\ )                                   // or anything between parenthesis
        | ${$re.escape("()")} /*interpolated variable*/ )  // or consecutive ( and )
        ( ?= ( =>|{ ) )                                    // followed by '=>' or '{'`
      .flags(`igm`),
    re02: $re`${hello}${String.raw`\s`}[Ww]+`.flags(`gi`),
    re03: $re`
      ${hello}
      // because all spaces are removed from the result, '<!32>'
      // must be used to create a 'hard' space (' ') in the
      // resulting Regex.
      // Alternatively, one can use $re.escape(" ")
      // (see next example)
      <!32>
      [Ww]+`.flags(`ig`),
    re05: $re`
      ( ${$re.escape(`https://google.`)} )
      .+
      ${[`gi`]} /* note: flags as last tag */`,
    re04: $re`
      [${$re.escape(` `)}]{1,} // thats all, bye
      `.flags(`u`),
    re06: $re`
      // loads of whitespace
      ( ? <=N )( ? <matchNumber>\d{3} )

      | ( ? <= DSC )( ? <matchSeconds> /* second */ \d{2} )
      
      | ( ? <= MC )( ? <matchMinutes> /* minute */ \d{2} )

      | ( ? <= HC )( ? <matchHours> /*hour*/ \d{2} ) |
      
      ( ? <= DD )( ?<matchDay> /* day */ \d{2} ) |
      
      ( ? <= MD )( ?<matchMonth> /* monthg */ \d{2} ) |
      
      ( ? <= YD )( ?<matchYear> /* year */ \d{2} | ( ? <= NOTHING )( ?<matchNoMatch> \d{2} ) )
      // append flags => `.flags(`g`)
      .flags(`u`),
    re07: $re`^
      [\p{L}]
      [\p{L}_\.#\-\d+~|=!] +@
      [\p{L}_\-]+\.
      [\p{L}_\.\-] + $`
      .flags(`gui`),
    re08: $re`
      ^[\p{L}]              //=> always start with a letter
      [\p{L}_\.#\-\d+~=!]+  //=> followed by letters including _ . # - 0-9 ~ = or !
      // [etc...]
      ${[...`giu`]}         //=> flags ([g]lobal, case [i]nsensitive, [u]nicode)`,
    re09: $re`
      [a-z0-7${$re.escape(" ")}]
      //       ^ that's a plain space
      | whatever ${[`ig*&^`]}
      //               ^ invalid flags are weeded out
    `,
    re10: $re`
      /* ------------------------------------------
          this removes all comments from a string
         ------------------------------------------ */
      \/\*(?:[^*]|\*+[^*\/])*\*+\/ // multiline (/* ... */)
      |                            // or
      (?<!:|\\\|')\/\/.*           // single line (// ...)
    `.flags(`gm`),
  }
}

function header() {
  style($);
  print(
    $.p({data: {header: true}},
      $.a( {
        target:"_top",
        href:"https://codeberg.org/KooiInc/RegexHelper",
      }, `Codeberg.org`) )
  );
  print(
    $.p({data: {header: true}},
      `Also used in`,
      $.a({target: "_blank", href: "https://codeberg.org/KooiInc/js-stringweaver", text: "js-stringweaver"}),
      ` and `,
      $.a({target: "_blank", href: "https://github.com/KooiInc/SBHelpers", text: "stackblitzhelpers"}),
    )
  );
}

function stringifyRE4Display(re) {
  return $.div({class: "resultArea"}).append($.textarea({name: "result", disabled: "disabled"}, re));
}
