<script setup>
// import * as Tone from "tone"
import { SortableArray, Sorter } from '@/libs/sort'
// import $ from 'jquery'

import 'bootstrap/dist/css/bootstrap.css'

const visual = ref({
  vlist: [],
  plist: [],
  plist: [],
  clist: [],
  focus: [],
  comphist: [],
  swaphist: [],
})
const audio = {
  ctx: undefined,
  vol: undefined,
  handle: [],
  freq: []
}
const colors = [
  '#36A2EB',
  '#FF6384',
  '#4BC0C0',
  '#FF9F40',
  '#9966FF',
  '#FFCD56',
  '#C9CBCF'
]

const init = (qty, max) => {
  /** AudioContext 는 반드시 키보드입력이 먼저 수행되어져야 활성화 된다. */
  if (!audio.ctx) {
    audio.ctx = new AudioContext()
    audio.vol = audio.ctx.createGain()
    audio.vol.connect(audio.ctx.destination)
    audio.vol.gain.value = 0.1
  }
  max = max - 10
  const clist = visual.value.clist = []
  const ilist = visual.value.plist = []
  const plist = visual.value.plist = []
  const vlist = visual.value.vlist = []
  const focus = visual.value.focus = []
  const swaphist = visual.value.swaphist = []
  const comphist = visual.value.comphist = []
  for (let inx = 0; inx < qty; inx++) {
    const v = (Math.round(Math.random() * max) + 1)
    ilist.push(inx)
    plist.push(inx)
    vlist.push(v)
    clist.push(colors[inx % colors.length])
  }
  comphist.push([])
  swaphist.push(JSON.parse(JSON.stringify(plist)))
  const sdata = JSON.parse(JSON.stringify(vlist))
  const sortable = new SortableArray(sdata, function(type, p1, p2) {
    switch (type) {
    case 'compare': {
      // console.log(`COMPARE:[${p1}]=${sdata[p1]} : [${p2}]=${sdata[p2]}`)
      comphist.push([plist[p1], plist[p2]])
      swaphist.push(JSON.parse(JSON.stringify(plist)))
    } break
    case 'swap': {
      // console.log(`SWAP:[${p1}]=${sdata[p1]} : [${p2}]=${sdata[p2]} -> [${p1}]=${sdata[p2]} : [${p2}]=${sdata[p1]} `)
      const v = plist[p1]
      plist[p1] = plist[p2]
      plist[p2] = v
      comphist.push([plist[p1], plist[p2]])
      swaphist.push(JSON.parse(JSON.stringify(plist)))
    } break
    default: console.log(...arguments) }
  })
  console.log('BEFORE:', JSON.stringify(sdata))
  // Sorter.heapsort(sortable)
  Sorter.quicksort(sortable)
  // Sorter.bubblesort(sortable)
  // Sorter.selectionsort(sortable)
  console.log('AFTER:', JSON.stringify(sdata))
  visual.value.plist = swaphist[0]
  const play = (hinx) => {
    visual.value.plist = swaphist[hinx]
    visual.value.vlist = JSON.parse(JSON.stringify(vlist))
    const focus = visual.value.focus = comphist[hinx]
    for (let inx = 0; inx < focus.length; inx++) {
      // console.log(`FOCUS:${vlist[focus[inx]]}`)
      tone(vlist[focus[inx]], inx)
    }
    if (hinx + 1 < swaphist.length) {
      setTimeout(() => play(hinx + 1), 100)
    }
  }
  setTimeout(() => play(0), 1000)
}

const tone = (freq, slot) => {
  if (audio.freq[slot]) {
    if (audio.freq[slot] != freq) {
      audio.handle[slot].stop()
      audio.handle[slot] = undefined
    }
  }
  const osc = audio.ctx.createOscillator();
  osc.connect(audio.vol);
  /** sine, square, sawtooth, triangle */
  osc.type = 'sine'
  osc.frequency.value = freq;
  osc.start();
  audio.handle[slot] = osc
  audio.freq[slot] = freq
  setTimeout(() => osc.stop(), 100)
}

const width = 1000
const height = 500
const qty = 30

</script>
<template>
  <div class="container">
    <h3>GRAPH</h3>
    <div>
      <svg :viewBox="`0 0 ${width} ${height}`" width="100%">
        <template v-for="(v, inx) in visual.vlist">
        <g
          :id="`g${inx}`"
          :style="`transform: translate(${(visual.plist.indexOf(inx)) * Math.floor(1.0 * width / visual.vlist.length)}px, 0px)`"
          class="svg-animation"
          >
          <rect
            x="0"
            :y="`${height - v}`"
            :width="`${Math.floor(1.0 * width / visual.vlist.length) - 2}`"
            :height="`${v}`"
            :fill="`${visual.clist[inx]}`"
            :class="`svg-animation ${visual.focus.indexOf(inx) != -1 ? 'focused' : ''}`"
            />
        </g>
        </template>
      </svg>
    </div>
    <div class="mt-1">
      <button
        class="btn btn-secondary mx-1"
        @click="() => init(qty, height)"
        >
        초기화
      </button>
      <button
        class="btn btn-primary mx-1"
        @click="test"
        >
        시작
      </button>
      <button
        class="btn btn-primary mx-1"
        @click="sorttest"
        >
        중지
      </button>
      <button
        class="btn btn-primary mx-1"
        >
        이전
      </button>
      <button
        class="btn btn-primary mx-1"
        >
        다음
      </button>
    </div>
  </div>
</template>
<style scoped>
.svg-animation {
  transition: transform 0.5s ease-in-out;
  transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
}

.mt-1 {
  margin-top: 0.25rem;
}

.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.my-1 {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-x-auto {
  overflow-x: auto;
}

.inline-block {
  display: inline-block;
}

.hidden {
  display: hidden;
}

.flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.justify-center {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.w-screen {
  width: 100vw;
}

.w-full {
  width: 100%;
}

.max-w-1\/2 {
  max-width: calc(50%);
}

.max-w-2\/3 {
  max-width: calc(100% * 2 / 3);
}

rect.focused {
  stroke: #000;
  stroke-width: 4px;
}
</style>