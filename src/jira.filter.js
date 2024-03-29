const GLOBAL_NAME = 'jira-issue-filter'
const STORAGE_NAME = GLOBAL_NAME
document.querySelector('html').classList.add(`c-${GLOBAL_NAME}`)

const style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = `
    .issuerow.is-hidden {
      display: none;
    }
    .c-${GLOBAL_NAME}__item {
      margin: 5px;
      padding: 10px;
      background: #f4f5f7;
      color: #505f79;
    }
    .c-${GLOBAL_NAME}__item:hover,
    .c-${GLOBAL_NAME}__item.is-active {
      background: #0747a6;
      color: #fff;
    }
    .c-${GLOBAL_NAME}__list {
      display: flex;
      list-style: none;
      margin: 10px 0;
      padding: 0;
      flex-wrap: wrap;
    }
    .c-${GLOBAL_NAME} #dashboard-content .gadget {
      position: relative;
      top: auto !important;
      right: auto !important;
      bottom: auto !important;
      left: auto !important;
      width: auto !important;
      margin-bottom: 20px;
    }
    .c-${GLOBAL_NAME} #dashboard-content .gadget-inline {
      height: auto !important;
    }
    .c-${GLOBAL_NAME} #dashboard-content .layout {
      display: none;
    }
  `
document.head.appendChild(style)

const createIssueFilter = (node = document) => {
  if (document.querySelector('.js-jira-filter')) return

  let lsJson = localStorage.getItem(STORAGE_NAME)
  if (!lsJson) lsJson = JSON.stringify([])
  const ls = JSON.parse(lsJson)

  ;[].slice
    .call(node.querySelectorAll('.search-results-dashboard-item-issue-table'))
    .forEach((issueTable) => {
      const gadgetId = issueTable.closest('div[id^="gadget-"]').id
      let gadget = ls.find((s) => s.gadget === gadgetId)
      if (!gadget) {
        ls.push({ gadget: gadgetId, filter: [] })
        gadget = ls.find((s) => s.gadget === gadgetId)
      }

      const projects = [].slice
        .call(issueTable.querySelectorAll('td.project'))
        .map((node) => ({ node, text: node.textContent.trim() }))
      const projectLabels = projects.reduce((arr, p) => {
        if (!arr.includes(p.text)) arr.push(p.text)
        return arr
      }, [])

      const toggleClasses = (toggler, type) => {
        const text = toggler.textContent.trim()
        projects
          .filter((p) => p.text === text)
          .forEach((p) => {
            toggler.classList[type]('is-active')
            p.node.closest('.issuerow').classList[type]('is-hidden')
          })
      }

      const toggleStorage = (toggler) => {
        const text = toggler.textContent.trim()
        if (gadget.filter.includes(text)) {
          gadget.filter = gadget.filter.filter((l) => l !== text)
        } else {
          gadget.filter.push(text)
        }
        localStorage.setItem(STORAGE_NAME, JSON.stringify(ls))
      }

      issueTable.insertAdjacentHTML(
        'afterbegin',
        `<div class="c-${GLOBAL_NAME}__container js-jira-filter">
          <ul class="c-${GLOBAL_NAME}__list">
              ${projectLabels
                .map(
                  (project) =>
                    `<li class="c-${GLOBAL_NAME}__item js-${GLOBAL_NAME}-toggler">${project}</li>`
                )
                .join('')}
          </ul>
      </div>`
      )
      ;[].slice
        .call(issueTable.querySelectorAll(`.js-${GLOBAL_NAME}-toggler`))
        .forEach((toggler) => {
          if (gadget.filter.includes(toggler.textContent.trim())) toggleClasses(toggler, 'add')

          toggler.addEventListener('click', (e) => {
            const type = !e.target.classList.contains('is-active') ? 'add' : 'remove'
            toggleClasses(e.target, type)
            toggleStorage(e.target)
          })
        })
    })
}

document.addEventListener('tempermonkey:changeurl', (e) => createIssueFilter())
