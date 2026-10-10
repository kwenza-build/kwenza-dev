'use strict'

// Highlights source blocks when the site is built, with the full highlight.js package, instead of
// in the browser with the default UI's bundled copy. That copy has no TOML grammar, and TOML is
// most of what kwenza's pages show. highlight.js handles TOML through its ini grammar (the `toml`
// alias) and shell sessions (`console`) through its shell grammar.
//
// It replaces Asciidoctor's built-in `highlight.js` adapter, which only marks blocks up for a
// client-side script. Pages ship highlighted HTML, so footer-scripts.hbs no longer loads that
// script. kwenza.css colours the hljs-* token classes.
//
// Registering a syntax highlighter is global, so this happens when the playbook's
// asciidoc.extensions entry loads the module; there's no register function for Antora to call.

const Asciidoctor = require('@asciidoctor/core')()
const hljs = require('highlight.js')

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }

Asciidoctor.SyntaxHighlighter.register('highlight.js', {
  handlesHighlighting: () => true,
  highlight: (node, source, lang) => {
    if (!lang || !hljs.getLanguage(lang)) return source.replace(/[&<>]/g, (c) => ESCAPES[c])
    return hljs.highlight(source, { language: lang, ignoreIllegals: true }).value
  },
  format: (node, lang) => {
    const langAttrs = lang ? ` class="language-${lang}" data-lang="${lang}"` : ''
    return `<pre class="highlight"><code${langAttrs}>${node.getContent()}</code></pre>`
  },
})
