<script setup>
import * as Tone from "tone"
import $ from 'jquery'

import 'bootstrap/dist/css/bootstrap.css'

const colors = [
  '#36A2EB',
  '#FF6384',
  '#4BC0C0',
  '#FF9F40',
  '#9966FF',
  '#FFCD56',
  '#C9CBCF'
]

const audio = {
  ctx: undefined,
  vol: undefined
}

onMounted(async () => {
  const g1 = document.querySelector('#g1')
  const r1 = document.querySelector('#g1 > rect')
  g1.classList.add('svg-animation')
  r1.classList.add('svg-animation')
  setTimeout(() => {
    r1.style.transform = `rotate(${90}deg)`
    g1.style.transform = `translate(${30}px, ${0}px)`

    const synth = new Tone.Synth().toDestination()
    const now = Tone.now()
    synth.volume.value = -10
    synth.triggerAttackRelease('C4', '16n', now)
    synth.triggerAttackRelease('E4', '16n', now + 0.25)
    synth.triggerAttackRelease('G4', '16n', now + 0.5)
  }, 2000)
  /** AudioContext 는 반드시 키보드입력이 먼저 수행되어져야 활성화 된다. */
  // {
  //   audio.ctx = new AudioContext()
  //   audio.vol = audio.ctx.createGain()
  //   audio.vol.connect(audio.ctx.destination)
  //   audio.vol.gain.value = 0.5
  // }
})

// const playTone = (freq) => {
//   const osc = audio.ctx.createOscillator();
//   osc.connect(audio.vol);
//   osc.type = 'square'
//   osc.frequency.value = freq;
//   osc.start();
//   return osc;
// }

</script>
<template>
  <div class="container">
    <h3>GRAPH</h3>
    <div>
      <svg viewBox="0 0 400 200" width="100%">
        <g id="g1">
          <rect x="0" y="0" width="10" height="10" fill="navy">
          </rect>
        </g>
      </svg>
    </div>
  </div>
</template>
<style scoped>
.svg-animation {
  transition: 0.5s ease-in-out;
  transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
}
</style>