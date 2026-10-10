// kwenza.dev's only script of its own: the light/dark switch, a search shortcut, and the home
// page's header name, which only appears once the big lockup has scrolled out of view.
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

  // Home page: the header leaves out the name while the big lockup is on screen, so it isn't
  // shown twice, and slides it in once the big one scrolls away. Without JavaScript (or
  // IntersectionObserver) the header simply always shows it.
  var hero = document.querySelector('.k-hero-lockup')
  if (hero && 'IntersectionObserver' in window) {
    var body = document.body
    body.classList.add('k-hero-pending')
    new IntersectionObserver(function (entries) {
      body.classList.toggle('k-hero-in-view', entries[0].isIntersecting)
      if (body.classList.contains('k-hero-pending')) {
        body.classList.remove('k-hero-pending')
        // Animate changes from now on, not the first decision on load.
        window.requestAnimationFrame(function () { body.classList.add('k-hero-ready') })
      }
    }, { rootMargin: '-56px 0px 0px 0px' }).observe(hero)
  }
})()
