// kwenza.dev's only script of its own: the light/dark switch and a search shortcut.
//
// The theme follows the OS (prefers-color-scheme) until someone flips the switch. Picking the
// opposite of the OS theme is remembered in localStorage; picking the same as the OS theme forgets
// the choice again, so the site goes back to following the system (the same rule as VitePress,
// which mise.jdx.dev uses). head-meta.hbs applies a remembered choice before first paint.
;(function () {
  'use strict'

  var KEY = 'kwenza-theme'
  var root = document.documentElement
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)')

  function isDark () {
    var chosen = root.dataset.theme
    return chosen ? chosen === 'dark' : systemDark.matches
  }

  function sync () {
    var dark = isDark()
    document.querySelectorAll('.k-theme-switch').forEach(function (button) {
      button.setAttribute('aria-checked', String(dark))
      button.title = dark ? 'Switch to light theme' : 'Switch to dark theme'
    })
  }

  function toggle () {
    var next = isDark() ? 'light' : 'dark'
    try {
      if ((next === 'dark') === systemDark.matches) {
        delete root.dataset.theme
        localStorage.removeItem(KEY)
      } else {
        root.dataset.theme = next
        localStorage.setItem(KEY, next)
      }
    } catch (e) {
      root.dataset.theme = next
    }
    sync()
  }

  document.querySelectorAll('.k-theme-switch').forEach(function (button) {
    button.addEventListener('click', toggle)
  })
  systemDark.addEventListener('change', sync)
  sync()

  document.addEventListener('keydown', function (e) {
    var input = document.getElementById('search-input')
    if (!input || e.target === input) return
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
    if ((e.key === '/' && !typing) || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault()
      input.focus()
    }
  })
})()
