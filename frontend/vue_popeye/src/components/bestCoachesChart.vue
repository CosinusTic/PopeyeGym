<template>
  <div class="">
    <Bar
      v-if="loaded"
      :width="500"
      :height="500"
      :options="options"
      :data="chartData"
    />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "bestCoachesChart",
  components: { Bar },
  data: () => ({
    colorBg: "#e73725",
    loaded: false,
    topCoaches: undefined,
    options: {
      scale: {
        ticks: {
          precision: 0,
        },
      },
    },
    chartData: {},
  }),
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.colorBg = "#ea6c36";
    } else {
      this.colorBg = "#e73725";
    }
    this.chartData = {
      labels: [],
      datasets: [
        {
          label: "Top 3 coaches (per current booking amount)",
          backgroundColor: this.colorBg,
          data: [],
        },
      ],
    }
  },
  methods: {
    async computeGraphData() {
      await fetch("http://localhost:3002/bestcoaches")
        .then((response) => response.json())
        .then((response) => {
          this.topCoaches = response;
          console.log(response);
        });
    },
    async fillGraph() {
      for (let i = 0; i < this.topCoaches.length; i++) {
        this.chartData.labels.push(this.topCoaches[i].coach_name);
        this.chartData.datasets[0].data.push(
          this.topCoaches[i].appoiment_count
        );
      }
      console.log("labels: ", this.chartData.labels);
      console.log("chart data: ", this.chartData.datasets[0].data);
      this.loaded = true;
    },
  },
  async mounted() {
    this.loaded = false;

    await this.computeGraphData();
    await this.fillGraph();
  },
};
</script>
