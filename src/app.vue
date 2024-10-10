<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import 'bootstrap/dist/css/bootstrap.css'

const chartData = ref({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [],
  }]
})

const colors = [
  '#36A2EB',
  '#FF6384',
  '#4BC0C0',
  '#FF9F40',
  '#9966FF',
  '#FFCD56',
  '#C9CBCF'
]

for (let inx = 0; inx < 30; inx++) {
  const label = `D-${inx}`
  chartData.value.labels.push(label)
  chartData.value.datasets[0].data.push(inx)
  chartData.value.datasets[0].backgroundColor.push(colors[inx % colors.length])
}

const chartOptions = {
  responsive: true,
  animation: {
    duration: 10
  }
}

const barchart = ref()

const myStyles = computed(() => ({
  // backgroundColor: '#f00'
}))

const swap = (model, inx1, inx2) => {
  const o = model[inx1]
  model[inx1] = model[inx2]
  model[inx2] = o
}

onMounted(async () => {
  console.log('CHART:', barchart.value)
  setTimeout(async () => {
    swap(chartData.value.datasets[0].data, 1, 10)
    swap(chartData.value.datasets[0].backgroundColor, 1, 10)
    swap(chartData.value.labels, 1, 10)
    chartData.value = JSON.parse(JSON.stringify(chartData.value))
    console.log('OK')
  }, 3000)
})

</script>
<template>
  <div class="container">
    <h3>GRAPH</h3>
    <div>
      <Bar
        ref="barchart"
        id="my-chart-id"
        aria-label="Sales figures for the years 2022 to 2024. Sales in 2022: 987, Sales in 2023: 1209, Sales in 2024: 825."
        :options="chartOptions"
        :data="chartData"
        :style="myStyles"
        />
    </div>
  </div>
</template>