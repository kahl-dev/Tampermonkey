// ==UserScript==
// @name         Jira
// @namespace    https://github.com/patrickkahl
// @version      1
// @description  Wrapper for Jira
// @author       Patrick Kahl <patrick@kahl.dev>
// @homepage     https://kahl.dev
// @include      *https://louis-internet.atlassian.net*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @require      http://localhost/npm/Tampermonkey/lib/jira.toggle.js
// @downloadURL  http://localhost/npm/Tampermonkey/jira.user.js
// @updateURL    http://localhost/npm/Tampermonkey/jira.user.js
// ==/UserScript==

;(function () {
  'use strict'

  const dispatchPageLoad = () => {
    const times = 3
    const delay = 1000

    for (let i = 0; i < times; i++) {
      setTimeout(() => document.dispatchEvent(new CustomEvent('tempermonkey:changeurl')), delay * i)
    }
    document.dispatchEvent(new CustomEvent('tempermonkey:changeurl'))
  }
  // Array.from(document.querySelectorAll('a.issue-link')).forEach((link) =>
  //   link.setAttribute('target', '_blank')
  // )

  // setTimeout(() => location.reload(), 60 * 1000)

  const observer = new MutationObserver((mutations, observer) => dispatchPageLoad())
  observer.observe(document.querySelector('head title'), { childList: true })
})()
