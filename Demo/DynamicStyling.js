export default initStyling;

function initStyling($) {
  $.fn("showOnTop", me => {
    return window.scroll({ top: document.body.scrollTop + me.dimensions.y - 10, });
  });
  
  // style rules are stored in the JQL style element (head)style#JQLStylesheet
  $.editCssRules(
    `:root {
      --grey-default: rgba(112, 92, 92, 0.9);
      --code-color: rgb(12, 13, 14);
    }`,
    `body {
      margin: 2rem;
    }`,
    `#log2screen {
      margin: 0px auto;
      width: 900px;
    }`,
    `.green {
        color: green;
    }`,
    `.red {
        color: red;
    }`,
    `button[data-code-visible="hidden"]:before {
      content: 'Display code';
    }`,
    `#top { position: absolute; top: 0; margin: 0;}`,
    `button[data-code-visible="visible"]:before {
      content: 'Hide code';
    }`,
    `.resultArea {
      &:before {
        content: " ➥ ";
        font-weight: bold;
        color: green;
        font-size: 1.1rem;
        display: inline-block;
        margin-right: 6px;
      }
      textarea {
        width: 96%;
        field-sizing: content;
        overflow-y: auto;
        background-color: #eee;
        color: #555;
        border: none;
        padding: 4px;
        vertical-align: top;
        font-family: 'courier new';
        font-weight: bold;
      }
    }`,
    `div.q { display: inline-block;
      padding: 0 6rem 0px 2rem;
      font-family: Georgia, verdana;
      font-style: italic;
      color: #777; }`,
    `div.q:before {
      font-family: Georgia, verdana;
      content: '\\201C';
      position: absolute;
      font-size: 2rem;
      color: #c0c0c0;
      margin-left: -2rem;
      margin-top: 0.5rem;
     }`,
    `div.q::after {
      font-family: Georgia, verdana;
      content: '\\201D';
      margin-left: 1rem;
      font-size: 2rem;
      margin-top: 0.5rem;
      position: absolute;
      display: inline-block;
      color: #c0c0c0; }`,
    `pre.codebox {
      box-shadow: 2px 2px 6px #555;
      border-radius: 6px;
      max-height: 500px;
      overflow: auto;
    }`,
    `code.hljs {
      background-color: #343636;
    }`,
    `code {
      color: revert;
      background-color: revert;
      padding: revert;
      font-family: revert;
    }`,
    `code:not(.codeblock, .hljs) {
        background-color: rgb(227, 230, 232);
        color: var(--code-color);
        padding: 0 4px;
        display: inline-block;
        border-radius: 4px;
        font-style: normal;
        font-weight: normal;
      }`,
    `code.codeblock {
        background-color: rgb(227, 230, 232);
        color: rgb(12, 13, 14);
        border: none;
        border-radius: 4px;
        padding: 4px;
      }`,
    `h2 {font-size: 1.3rem; line-height: 1.4rem}`,
    `pre:not(.codebox).syntax {
      margin-top: 0.2rem;
    }`,
    `b.note { color: red; }`,
    `.normal {
       font-family: system-ui, sans-serif;
       color: var(--grey-default);
       margin: 3px auto;
       ul {
        margin-left: 1.2em;
        li {
          list-style: "✓" !important;
          &:last-child {
            margin-bottom: 1em !important;
          }
        }
       }
     }`,
    `.b5 { margin-bottom: 0.5rem; }`,
    `h1.head, h2.head, h3.head {
      color: var(--grey-default);
      font-family: system-ui, sans-serif;
      margin-bottom: 0.4rem;
    }`,
    `h2.head { scroll-margin-top: 20px; }`,
    `h3.head {
      font-size: 1.1rem;
     }`,
    `h3.head.between {
        margin-top: 0.4rem;
     }`,
    `h2.head, h1.head {
       border: 1px dotted var(--grey-default);
       padding: 0.3rem;
       text-align: center;
     }`,
    `h4.between { margin: 0.4em 0 0.2em 0; }`,
    `h1.head { line-height: 1.6em; }`,
    `#log2screen li:not(.head) {
      line-height: 1.4em;
      list-style: none;
     }`,
    `#log2screen li div.normal li {
      list-style: none;
      margin-left: -3em;
    }`,
    `#log2screen li:last-child {
      margin-bottom: 100vh;
    }`,
    `details {
        summary { cursor: pointer; }
    }`,
    `details.in-content {
      scroll-margin-top: 20px;

      summary {
        cursor: pointer;
        &:hover {
          background-color: #EEE;
        }
        h3.summary {
          cursor: pointer: !important;
          font-family: monospace;
          color: rgb(98 109 147);
          font-size: 1.1em;
          display: inline;
          z-index: 100;
          &:hover {
            color: green;
          }
        }
      }
    }`,
    `details.in-content:not(:open) + .chapterContent {
      position: absolute;
      left: -200vw;
      height: 0;
      opacity: 0;
    }`,
    `details.in-content[open] summary h3 { color: green; }`,
    `details.in-content[open] + .chapterContent {
      margin: 0.3em 1em auto 1em;
      height: revert;
      position: relative;
      transition: margin 0.8s ease-in, opacity 0.6s ease-in;
      opacity: 1;
      pre {
        margin-top: 0.1rem;
      }
    }`,
    `a.ExternalLink {
      background-color: transparent;
      font-style: normal;
    }`,
    `a.ExternalLink.arrow:hover::after, .toc:hover::after, .internalLink:hover::after {
        fontSize: 0.7rem;
        position: absolute;
        zIndex: 2;
        display: inline-block;
        padding: 1px 6px;
        border: 1px solid #777;
        box-shadow: 1px 1px 5px #777;
        margin: 1rem 0 0 -1rem;
        color: #444;
        background-color: #FFF;
    }`,
    `.toc:hover::after {
      margin: -0.3rem 0px 0px -6rem;
    }`,
    `a.ExternalLink[data-backto].arrow:hover::after {
      content: ' navigates back to 'attr(data-backto);
    }`,
    `a.ExternalLink[data-internal].arrow:hover::after {
      content: ' navigate to 'attr(data-internal);
    }`,
    `.internalLink:hover::after {
      content: ' navigate to 'attr(data-internal);
    }`,
    `a.ExternalLink[target="_top"]:not([data-backto], [data-internal]).arrow:hover::after {
      content: ' navigates back to 'attr(href);
    }`,
    `a.ExternalLink[target="_blank"].arrow:hover::after {
      content: ' Opens in new tab/window';
    }`,
    `div.lemma {
      cursor: pointer;
      text-decoration: none;
      color: #777;
      margin-left: 1rem;
      display: block;
      &:hover {
        text-decoration: underline;
      }
      &:before {
        content: "✓ ";
      }
      &[data-active='1'] {
        background-color: #eee;
        color: green;
      }
    }`,
    `.internalLink {
        color: blue;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        font-style: normal;
        &:hover {
          text-decoration: underline;
        }
        &:before {
          color: rgba(0, 0, 238, 0.7);
          font-size: 1.1rem;
          padding-right: 2px;
          vertical-align: baseline;
          content: "↺"
        }
      }`,
    `.back-to-top {
      position: fixed;
      background-color: white;
      scroll-margin-top: 10px;
      top: 1rem;
      cursor: pointer;
      z-index: 5;
      border: 1px solid #777;
      text-align: center;
      padding: 2px 2px 4px;
      border-radius: 4px;
      .menu {
        text-align: left;
        position: absolute;
        opacity: 0;
        left: -200vw;
      }
      .menu [data-action] {
        margin: 0.2rem 0;
        cursor: pointer;
        color: rgb(119, 119, 119);

        &:hover {
          color: green;
          background-color: rgb(238, 238, 238);
        }
        &::before {
          content: "✓ ";
        }
      }
      &:hover {
        &:before { content: ""; }
        padding: 0.6rem;
        border: none;
        box-shadow: 2px 2px 6px #AAA;
      }
      &:hover .menu {
        left: auto;
        position: relative;
        opacity: 1;
        transition: all 0.5s ease-in;
      }
      &:before {
        content: "\\2630";
        font-size: 1.6em;
        font-weight: bold;
        color: #8f5536;
      }
     }`,
    `table {
      margin: 1rem 0;
      font-family: verdana;
      font-size: 0.9rem;
      border-collapse: collapse;
      vertical-align: top;
      max-width: 100%;

      td, th {
        padding: 2px 4px;
        font-size: 14px;
        height: 18px;
        vertical-align: top;
      }

      th {
        font-weight: bold;
        text-align: left;
        border-bottom: 1px solid #999;
        background-color: #999;
        color: #FFF;
      }

      td:first-child, th:first-child {
        text-align: right; padding-right: 5px;
        min-width: 12px;
        max-width: 36px;
      }
      caption {
        border: 1px solid #ccc;
        padding: 0.5rem;
        font-size: 14px;
        white-space: nowrap;
       }

       tbody tr:nth-child(even) { background-color: #ddd; }
     }`,
    `.notifyHeader {
      color: #555;
      &:before {
        content: '* ';}
    }`,
    `.bottomSpacer {
      min-height: 100vh;
    }`,
    `.spin {
      display: block;
      animation: spinner 1.5s linear infinite;
      color: red;
      text-align: center;
    }`,
    `span.quoted {
      color: #555;
      font-size: 1.2em;
      font-weight: bold;
      font-family: serif;
    }`,
    `@keyframes spinner  {
      from {
        -moz-transform: rotateY(0deg);
        -ms-transform: rotateY(0deg);
        transform: rotateY(0deg);
      }
      to {
        -moz-transform: rotateY(-360deg);
        -ms-transform: rotateY(-360deg);
        transform: rotateY(-360deg);
      }
    }`
  );
}
