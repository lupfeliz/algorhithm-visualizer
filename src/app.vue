<script setup>
/**
 * @File        : app.vue
 * @Author      : 정재백
 * @Since       : 2024-10-12
 * @Description : 정렬 알고리즘 설명용 웹앱
 * @Site        : https://devlog.ntiple.com
 **/
import { SortableArray, Sorter } from '@/libs/sort'
import { BButton, BDropdown } from 'bootstrap-vue-next'

const width = 1000
const height = 500
const qty = 30

const inf = ref({
  vlist: [],
  plist: [],
  clist: [],
  focus: [],
  comphist: [],
  swaphist: [],
  cstate: {},
  orgdata: '',
  sortType: '',
  orderType: '',
  statistics: [],
  handle: undefined,
  hinx: 0,
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

onMounted(async () => {
  init(qty, height)
})

const init = (qty, max) => {
  max = max - 10
  const vlist = inf.value.vlist = []
  const clist = inf.value.clist = []
  const plist = inf.value.plist = []
  for (let inx = 0; inx < qty; inx++) {
    plist.push(inx)
    vlist.push(Math.round(Math.random() * max) + 1)
    clist.push(colors[inx % colors.length])
  }
  inf.value.orgdata = JSON.stringify(inf.value.vlist)
}

const start = () => {
  if (!audio.ctx) {
    audio.ctx = new AudioContext()
    audio.vol = audio.ctx.createGain()
    audio.vol.connect(audio.ctx.destination)
    audio.vol.gain.value = 0.1
  }
  const vlist = JSON.parse(inf.value.orgdata)
  const plist = inf.value.plist = []
  const swaphist = inf.value.swaphist = []
  const comphist = inf.value.comphist = []
  const stathist = inf.value.statistics = []
  const sdata = JSON.parse(inf.value.orgdata)
  for (let inx = 0; inx < qty; inx++) {
    plist.push(inx)
  }
  const sortable = new SortableArray(sdata, function(type, p1, p2) {
    const lstat = stathist[(stathist.length || 1) - 1] || { comp: 0, swap: 0 }
    switch (type) {
    case 'compare': {
      // console.log(`COMPARE:[${p1}]=${sdata[p1]} : [${p2}]=${sdata[p2]}`)
      comphist.push([plist[p1], plist[p2]])
      swaphist.push(JSON.parse(JSON.stringify(plist)))
      stathist.push({ comp: lstat.comp + 1, swap: lstat.swap })
    } break
    case 'swap': {
      // console.log(`SWAP:[${p1}]=${sdata[p1]} : [${p2}]=${sdata[p2]} -> [${p1}]=${sdata[p2]} : [${p2}]=${sdata[p1]} `)
      const v = plist[p1]
      plist[p1] = plist[p2]
      plist[p2] = v
      comphist.push([plist[p1], plist[p2]])
      swaphist.push(JSON.parse(JSON.stringify(plist)))
      stathist.push({ comp: lstat.comp, swap: lstat.swap + 1 })
    } break
    default: console.log(...arguments) }
  })
  comphist.push([])
  swaphist.push(JSON.parse(JSON.stringify(plist)))
  stathist.push({ comp: 0, swap: 0 })
  console.log('BEFORE:', JSON.stringify(sdata))
  let ascending = true
  if (inf.value.orderType == 'Descending') { ascending = false }
  switch (inf.value.sortType) {
  case 'BubbleSort': { Sorter.bubblesort(sortable, ascending) } break
  case 'SelectionSort': { Sorter.selectionsort(sortable, ascending) } break
  case 'HeapSort': { Sorter.heapsort(sortable, ascending) } break
  case 'QuickSort': 
  default: { Sorter.quicksort(sortable, ascending) } break
  }
  console.log('AFTER:', JSON.stringify(sdata))
  inf.value.plist = swaphist[0]
  play = (hinx) => {
    if (inf.value.handle) { clearTimeout(inf.value.handle) }
    inf.value.hinx = hinx
    inf.value.plist = swaphist[hinx]
    inf.value.vlist = JSON.parse(JSON.stringify(vlist))
    inf.value.cstate = inf.value.statistics[hinx]
    const focus = inf.value.focus = comphist[hinx]
    for (let inx = 0; inx < focus.length; inx++) {
      // console.log(`FOCUS:${vlist[focus[inx]]}`)
      tone(vlist[focus[inx]], inx)
    }
    if (hinx + 1 < swaphist.length) {
      inf.value.handle = setTimeout(() => play(hinx + 1), 100)
    }
  }
  inf.value.handle = setTimeout(() => play(0), 500)
}
let play = (hinx) => { }
const stop = () => {
  if (inf.value.handle) {
    clearTimeout(inf.value.handle)
    inf.value.handle = undefined
  } else {
    play(inf.value.hinx)
  }
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


</script>
<template>
  <div class="container">
    <h3>Algorithm Visualizer</h3>
    <hr/>
    <h4>Sort</h4>
    <hr/>
    <section>
      <svg :viewBox="`0 0 ${width} ${height}`" width="100%">
        <template v-for="(v, inx) in inf.vlist">
        <g
          :id="`g${inx}`"
          :style="`transform: translate(${(inf.plist.indexOf(inx)) * Math.floor(1.0 * width / inf.vlist.length)}px, 0px)`"
          class="svg-animation"
          >
          <rect
            x="0"
            :y="`${height - v}`"
            :width="`${Math.floor(1.0 * width / inf.vlist.length) - 2}`"
            :height="`${v}`"
            :fill="`${inf.clist[inx]}`"
            :class="`svg-animation ${inf.focus.indexOf(inx) != -1 ? 'focused' : ''}`"
            />
        </g>
        </template>
      </svg>
    </section>
    <section class="mt-1 flex justify-center">
      <BButton
        class="mx-1"
        variant="warning"
        @click="() => init(qty, height)"
        >
        Initialize
      </BButton>
      <BDropdown
        class="mx-1"
        :text="`${inf.sortType || 'QuickSort'}`"
        >
        <BDropdownItem @click="() => inf.sortType = 'BubbleSort'">BubbleSort</BDropdownItem>
        <BDropdownItem @click="() => inf.sortType = 'SelectionSort'">SelectionSort</BDropdownItem>
        <BDropdownItem @click="() => inf.sortType = 'HeapSort'">HeapSort</BDropdownItem>
        <BDropdownItem @click="() => inf.sortType = 'QuickSort'">QuickSort</BDropdownItem>
      </BDropdown>
      <BDropdown
        class="mx-1"
        :text="`${inf.orderType || 'Ascending'}`"
        >
        <BDropdownItem @click="() => inf.orderType = 'Ascending'">Ascending</BDropdownItem>
        <BDropdownItem @click="() => inf.orderType = 'Descending'">Descending</BDropdownItem>
      </BDropdown>
      <BButton
        class="mx-1"
        variant="primary"
        @click="start"
        >
        Start!
      </BButton>
      <template v-if="inf.hinx > 0 && inf.hinx < inf.swaphist.length - 1">
        <BButton
          class="mx-1"
          variant="danger"
          @click="stop"
          >
          <template v-if="inf.handle">
          Stop!
          </template>
          <template v-else>
          Resume!
          </template>
        </BButton>
      </template>
      <!--
      <BButton
        class="mx-1"
        >
        이전
      </BButton>
      <BButton
        class="mx-1"
        >
        다음
      </BButton>
      -->
    </section>
    <section>
      <div>
        Data length : <span v-html="`${inf.vlist.length || 0}`"></span>
      </div>
      <div>
        Compare : <span v-html="`${inf.cstate.comp || 0}`"></span>
      </div>
      <div>
        Swap : <span v-html="`${inf.cstate.swap || 0}`"></span>
      </div>
    </section>
  </div>
</template>
<style scoped>
.svg-animation {
  transition:
    transform 0.5s ease-in-out,
    height 0.5s ease-in-out,
    y 0.5s ease-in-out
  ;
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