const {$, logFactory} = (await import("https://unpkg.com/stackblitzhelpers@latest/index.browser.bundled.js"));
import $re from "../RegexpCreator.js";
import style from "./DynamicStyling.js";
const exampleCode = await fetchTemplates($);
const usageResults = retrieveUsageResults();
const {log: print} = logFactory(true);
const asHeader = {data: {header: true}};
demo();

function demo() {
  header();

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

  printUsageExamples();

  hljs.highlightAll(`javascript`);
}

function printUsageExamples() {
  print($.h2({class: "head"}, `Usage examples`),
    $.div({class: `b5`}, `Some <code>$re</code> usage examples`));

  print(exampleCode.use01.codeblock);

  print(
    $.div({class: "b5"},
      $.code(`someStringWithComments.match(commentsRE)`),
      $.div({class: "useResult"}, usageResults.use01)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`someStringWithComments.replace(commentsRE, '')`),
      $.div({class: "useResult"}, usageResults.use02)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`someStringWithComments<b class="red">.flags("-r")</b>.replace(commentsRE, '')`),
      $.div({class: "useResult"}, usageResults.use02a)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`someStringWithComments<b class="red">.flags("-r|i")</b>.replace(commentsRE, '')`),
      $.div({class: "useResult"}, usageResults.use02b)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`commentsRE.exec(someStringWithComments)`),
      $.div({class: "useResult"}, usageResults.use03)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`commentsRE.test(someStringWithComments)`),
      $.div({class: "useResult"}, usageResults.use04)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`commentsRE.test("no comments")`),
      $.div({class: "useResult"}, usageResults.use05)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`someStringWithComments.split(commentsRE)`),
      $.div({class: "useResult"}, usageResults.use06)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`commentsRE.dotAll`),
      $.div({class: "useResult"}, usageResults.use07)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`commentsRE.flags("s").dotAll`),
      $.div({class: "useResult"}, `${usageResults.use08}`)
    )
  );

  print(
    $.div({class: "b5"},
      $.code(`commentsRE.source`),
      $.div({class: "useResult"}, `${usageResults.use09}`)
    )
  );
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

function retrieveUsageResults() {
  const commentsRE = () => $re`
      /* ------------------------------------------
          this removes all comments from a string
         ------------------------------------------ */
      \/\*(?:[^*]|\*+[^*\/])*\*+\/ // multiline (/* ... */)
      |                            // or
      (?<!:|\\\|')\/\/.*           // single line (// ...)
    `.flags(`gm`);
  const someStringWithComments = `
    /* this is an example string with comments */
    Hello /* comment in between */ world!
    // that's it folks
  `;
  const execRE = commentsRE();
  const executed = execRE.exec(someStringWithComments);
  return {
    use01: `[${someStringWithComments.match(commentsRE()).join(', ')}]`,
    use02: someStringWithComments.replace(commentsRE(), ''),
    use02a: someStringWithComments.replace(commentsRE().flags(`-r`), ''),
    use02b: someStringWithComments.replace(commentsRE().flags(`-r|i`), ''),
    use03: `[${executed}] (<code>commentsRE.lastIndex</code>: ${execRE.lastIndex})`,
    use04: `${commentsRE().test(someStringWithComments)}`,
    use05: `${commentsRE().test(`no comments`)}`,
    use06: JSON.stringify(someStringWithComments.split(commentsRE())),
    use07: commentsRE().dotAll,
    use08: `${commentsRE().flags(`s`).dotAll}
      (<code>commentsRE<b class="red">.re</b>.flags</code>: "${
        commentsRE().flags(`s`).re.flags}) }")`,
    use09: `${commentsRE().source}`
  }
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
    $.p(asHeader,
      $.a( {
        target:"_top",
        href:"https://codeberg.org/KooiInc/RegexHelper",
      }, `Codeberg.org`) )
  );
  print(
    $.p(asHeader,
      `Also used in`,
      $.a({target: "_blank", href: "https://codeberg.org/KooiInc/js-stringweaver", text: "js-stringweaver"}),
      ` and `,
      $.a({target: "_blank", href: "https://github.com/KooiInc/SBHelpers", text: "stackblitzhelpers"}),
    )
  );

  print($.h2({class: "head"}, `RegexHelper`),
    $.div({class: `b5`}, `This module delivers a 'constructor' to create
      Regular Expressions from a multiline string with comments.`),
    $.div({class: `b5`}, `The constructor is here imported as <code>$re</code>.
      <code>$re</code> is actually a `,
        $.a({
          target: "_blank",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates",
          text: "tagged template"}),
        ` [function] and can <i class="red">only</i> be called as such (so <code>$re\`[regexp string]\`</code> and 
            <i class="red">not</i>
            <code><b class="red">$re(\`[regexp string]\`</b></code>).`
      ),
      $.div({class: `b5`}, `The constructor result is actually a `,
        $.a({
          target: "_blank",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy",
          text: "Proxy"}),
          ` for an ES regular expression object. This means the result can be used straightforward
           as an ES regular expression (except for the <code>flags</code> property), see 'Usage examples').`
      ),
      $.div({class: `b5`},
        $.h3({class: "head between"}, `Flags`),
        $.div({class: `b5`}, `Flags can be added using the instance flags method
          <code>[$re instance].flags(flags:string)</code> or (legacy) by adding an Array of
          flag strings as <i class="red">last</i> replacement in the template string e.g.
          <code>$re\`[ABZ].+ \${[..."gu"]}\`</code>.`),
        $.div({class: `b5`},
          `To <b>remove</b> all flags use <code>[$re instance].flags(<b class="red">"-r"</b>)</code>`),
        $.div({class: `b5`},
          `To <b>replace</b> all flags use <code>[$re instance].flags(<b class="red">"-r|[replacements]"</b>)</code>.`),
        $.div({class: `b5`}, `<b class="red">Note</b>: flags are cleaned upon creation.`)
      ),
      $.div({class: `b5`},
        $.h3({class: "head between"}, `The instance value`),
        $.div({class: `b5`}, `The instance value (so the actual <code>RegExp</code> value) can be retrieved
          using either <code>[$re instance].re</code> or <code>[$re instance].valueOf()</code>.`),
        $.div({class: `b5`}, `<code>String([$re instance].re</code>), <code>[$re instance].toString()</code>
          or <code>\`\${[$re instance]}\`</code>) delivers the stringified actual <code>RegExp</code> value.`),
      )
    );

  print($.h2({class: "head"}, `Constructor examples`),
    $.div({class: `b5`}, `Some instance creation examples
        using the imported <code>$re</code> constructor.`));
}

function stringifyRE4Display(re) {
  return $.div({class: "resultArea"}).append($.textarea({name: "result", disabled: "disabled"}, re));
}
