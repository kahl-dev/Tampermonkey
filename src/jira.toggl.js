const initToggl = () => {
  if (document.querySelector('#toggl-clipboard')) return
  const breadcrump = document.querySelector('nav[aria-label="Breadcrumbs"]')
  if (!breadcrump) return
  breadcrump.insertAdjacentHTML(
    'beforebegin',`<button id="toggl-clipboard" style="border:none;background:none;margin-right:15px;position:relative;">
      <img src="https://web-assets.toggl.com/app/assets/images/favicon.b87d0d2d.ico" style="width:20px;height:20px;">
    </button>`
  )
  GM.addStyle("#toggl-clipboard.is-error:after, #toggl-clipboard.is-running:after { position: absolute; top: -10px; right: -1px; font-weight: bold; font-size: 20px; text-shadow: 0px 0px 5px black; } #toggl-clipboard.is-error:after { content: '\\78'; color: lightgreen; } #toggl-clipboard.is-running:after { content: '\\2713'; color: lightgreen; }")
  document.querySelector('#toggl-clipboard')?.addEventListener('click', async (e) => {
    const title = document.title.split(/ -(?!.* -)/)[0]
    const ticketArr = title.split(/ (.+)/)
    const content = `${ticketArr[0].replace(/[\[\]]/g, '')} - ${ticketArr[1]}`

    const togglApiToken = await GM.getValue('TOGGL_API_TOKEN')
    const togglClientID = await GM.getValue('TOGGL_CLIENT_ID')
    const togglWorkspaceID = await GM.getValue('TOGGL_WORKSPACE_ID')

    let res = await GM.xmlHttpRequest({
      method: 'GET',
      url: `https://api.track.toggl.com/api/v8/clients/${togglClientID}/projects`,
      headers: {
        Authorization: 'Basic ' + btoa(`${togglApiToken}:api_token`),
        'Content-Type': 'application/json',
      },
      synchronous: true,
    })

    if (res.status !== 200) {
      document.querySelector('#toggl-clipboard').classList.add('is-error')
      return
    }
    const clients = JSON.parse(res.response)
    let project = clients.find((client) => client.name === document.title.match(/\[([A-Z]+)\-/)[1])

    if (!project) {
      res = await GM.xmlHttpRequest({
        method: 'POST',
        url: 'https://api.track.toggl.com/api/v8/projects',
        data: JSON.stringify({
          project: {
            name: document.title.match(/\[([A-Z]+)\-/)[1],
            wid: togglWorkspaceID,
            is_private: true,
            cid: togglClientID,
          },
        }),
        headers: {
          Authorization: 'Basic ' + btoa(`${togglApiToken}:api_token`),
          'Content-Type': 'application/json',
        },
        synchronous: true,
      })

      if (res.status !== 200) {
        document.querySelector('#toggl-clipboard').classList.add('is-error')
        return
      }

      const data = JSON.parse(res.response)
      project = data.data
    }

    res = await GM.xmlHttpRequest({
      method: 'POST',
      url: 'https://api.track.toggl.com/api/v8/time_entries/start',
      data: JSON.stringify({
        time_entry: { pid: project.id, description: content, created_with: 'tampermonkey' },
      }),
      headers: {
        Authorization: 'Basic ' + btoa(`${togglApiToken}:api_token`),
        'Content-Type': 'application/json',
      },
      synchronous: true,
    })

    if (res.status !== 200) {
      document.querySelector('#toggl-clipboard').classList.add('is-error')
      return
    }

    document.querySelector('#toggl-clipboard').classList.add('is-running')

    // GM_notification({
    //   text: `Copied "${content}" to clipboard`,
    //   title: 'Toggl',
    //   highlight: true,
    //   timeout: 2000,
    //   image: 'https://i.stack.imgur.com/geLPT.png',
    //   onclick: () => {
    //     console.log('My notice was clicked.')
    //     window.focus()
    //   },
    //   ondone: () => {
    //     console.log('done')
    //
    //   }
    // })
  })
}

document.addEventListener('tempermonkey:changeurl', (e) => initToggl())
