;(function () {
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

  setTimeout(() => {
    const observer = new MutationObserver((mutations, observer) => dispatchPageLoad())
    observer.observe(document.querySelector('head title'), { childList: true })
    dispatchPageLoad()
  }, 1000)
})()
