<script setup>
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

onMounted(async () => {
  const g1 = document.querySelector('#g1')
  const r1 = document.querySelector('#g1 > rect')
  g1.classList.add('svg-animation')
  r1.classList.add('svg-animation')

  setTimeout(() => {
    r1.style.transform = `rotate(${90}deg)`
    g1.style.transform = `translate(${30}px, ${0}px)`
  }, 500)
})

</script>
<template>
  <div class="container">
    <h3>GRAPH</h3>
    <div>
      <svg viewBox="0 0 100 100" width="100%">
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