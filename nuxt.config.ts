/**
 * @File        : nuxt.config.ts
 * @Author      : 정재백
 * @Since       : 2024-10-12
 * @Description : nextjs 구동설정
 * @Site        : https://devlog.ntiple.com
 * 
 * https://nuxt.com/docs/api/configuration/nuxt-config
 **/

// import legacy from '@vitejs/plugin-legacy'
import path, { dirname } from 'path'

const dir = dirname(__filename)
const distdir = path.join(dir, 'dist')

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
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2015'
      }
    },
    plugins: [
    ],
  },
  nitro: {
    output: { publicDir: distdir }
  },
  app: {
    head: {
    },
  },
})