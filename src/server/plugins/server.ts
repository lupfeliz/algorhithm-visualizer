/**
 * @File        : server.ts
 * @Author      : 정재백
 * @Since       : 2024-10-12
 * @Description : vite-plugin-legacy 를 지원하기 위한 source-modifier
 * @Site        : https://devlog.ntiple.com
 **/
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    // html.head.push( `<script></script>`,)
    // console.log('CHECK:', html)
  })
  /** FIXME: 현재 극히일부 상황에 대한 처리만 하였으므로 더 테스트가 필요함 */
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    // console.log('render:response', event?.context?.params?._, response.body)
    if (/(^$|^[a-zA-Z0-9_-]+$|\/[a-zA-Z0-9_-]+$|\.html$)/.test(String(event?.context?.params?._))) {
      // console.log('render:response', event?.context?.params?._)
      let st = 0, ed = 0
      let html = String(response.body)
      const nd1 = '<script type="module" src="/_nuxt/'
      const nd2 = '" crossorigin></script>'
      let nth = 0
      let fname = '', tag = ''
      for (let inx = 0; inx < 999; inx++) {
        st = html.indexOf(nd1, ed)
        ed = html.indexOf(nd2, st + nd1.length)
        if (st != -1 && ed != -1 && (ed - st - nd1.length) < 30) {
          fname = html.substring(st + nd1.length, ed)
          if (nth === 0) {
            tag = `<script type="systemjs-module" src="/_nuxt/${fname}" crossorigin></script>`
            html = `${html.substring(0, st)}${tag}${html.substring(ed + nd2.length)}`
            ed = st + tag.length
          } else if (!fname.endsWith('-legacy.js')) {
            html = `${html.substring(0, st)}${html.substring(ed + nd2.length)}`
            ed = st 
          }
          // console.log('SCRIPT:', fname, tag)
          nth += 1
        } else {
          break
        }
      }
      response.body = html
    }
  })
})