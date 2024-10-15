/**
 * @File        : nuxt.config.ts
 * @Author      : 정재백
 * @Since       : 2024-10-12
 * @Description : nextjs 구동설정
 * @Site        : https://devlog.ntiple.com
 * 
 * https://nuxt.com/docs/api/configuration/nuxt-config
 **/

import legacy from '@vitejs/plugin-legacy'
import path, { dirname } from 'path'
import { existsSync } from 'fs'
import { type Plugin, type TransformResult } from 'vite';

const log = { debug: console.log }
const dir = dirname(__filename)
const distdir = path.join(dir, 'dist')
const baseURL = ''
const env: any = process.env
env.BASE_DIR = dir
env.BASE_URL = baseURL

const sourceModifier = () => ({
  name: 'source-modifier-plugin',
  enforce: 'pre',
  async transform(src: string, fname: string) {
    const ret: TransformResult = undefined as any
    return ret
  },
} as any as Plugin[])

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  experimental: { viewTransition: true },
  srcDir: 'src',
  modules: ['@bootstrap-vue-next/nuxt'],
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  build: {
    // transpile: [ 'vue' ],
    // analyze: false,
  },
  vite: {
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11', 'chrome > 59', 'firefox > 60'],
        externalSystemJS: false,
      }),
      sourceModifier()
    ],
    build: {
      minify: true,
      rollupOptions: {
        output: {
          /** legacy 플러그인 사용시 파일명 고정이 안됨 */
          /** entry 스크립트인지 구분하기 위해 파일명 수정 */
          // entryFileNames: 'entry/[hash].js',
          // chunkFileNames: "chunk/[hash].js",
          // assetFileNames: '[ext]/[hash].[ext]'
        },
      },
    },
  },
  nitro: {
    output: { publicDir: distdir }
  },
  app: {
    head: {
      script: [ { src: `${baseURL}/system.min.js` } ]
    },
    baseURL,
  },
})