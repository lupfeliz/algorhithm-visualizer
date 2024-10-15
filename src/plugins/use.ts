/**
 * @File        : use.ts
 * @Author      : 정재백
 * @Since       : 2024-10-12
 * @Description : nuxtjs 플러그인 정의 및 polyfill 선언
 * @Site        : https://devlog.ntiple.com
 **/
import 'core-js'
import ResizeObserver from 'resize-observer-polyfill'
if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserver
}

const plugin = defineNuxtPlugin(nuxtApp => {
  const vueApp = nuxtApp.vueApp
})

export default plugin