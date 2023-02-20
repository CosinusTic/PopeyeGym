<template>
  <div class="">
    <Bar v-if="loaded" :width="500" :height="500" :data="chartData" />
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
  name: "appointmentChart",
  components: { Bar },
  data: () => ({
    colorBg: "#e73725",
    loaded: false,
    bookings: undefined,
    allAppointments: undefined,
    chartData: {},
  }),
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.colorBg = "#ea6c36";
    } else {
      this.colorBg = "#e73725";
    }
    this.chartData = {
      //{" Jan": 6, " Feb": 2, " Mar": 1}
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Nbr of Bookings",
          backgroundColor: this.colorBg,
          // data: [0, 0, 0]
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    };
  },

  methods: {
    async secondComputeCharts() {
      await fetch("http://localhost:3002/appointments/countPerMonth")
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          this.bookings = response;
        });
      if (this.bookings.Jan) {
        this.chartData.datasets[0].data.push(this.bookings.Jan);
      }
      if (this.bookings.Feb) {
        this.chartData.datasets[0].data.push(this.bookings.Feb);
      }
      if (this.bookings.Mar) {
        this.chartData.datasets[0].data.push(this.bookings.Mar);
      }
    },
    async computeCharts() {
      try {
        await fetch("http://localhost:3002/appointmentsCountMonth")
          .then((response) => response.json())
          .then((response) => (this.bookings = response));
        for (let i = 0; i < this.bookings.length; i++) {
          for (let j = 0; j < this.chartData.labels.length; j++) {
            if (this.bookings[i]._id.split(0)[1] == j) {
              console.log("-------------------");
              console.log("booking index: ", this.bookings[i]._id.split(0)[1]);
              console.log("value: ", this.chartData.labels[i]);
              console.log("month index: ", j);
              console.log("-------------------");
              this.chartData.datasets[0].data.push(
                this.bookings[i].numberofbookings
              );
            }
          }
        }
        console.log("chart data: ", this.chartData.datasets[0].data);
        this.loaded = true;
      } catch (e) {
        console.error(e);
      }
    },
    // Bookings: [ { "month": "January", "count": 6 }, { "month": "February", "count": 2 }, { "month": "March", "count": 1 } ]
    //Months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    async secondCompute() {
      try {
        await fetch("http://localhost:3002/appointments/countPerMonth")
          .then((response) => response.json())
          .then((response) => (this.bookings = response));
        for (let i = 0; i < this.bookings.length; i++) {
          for (let j = 0; j < this.chartData.labels.length; j++) {
            if (this.bookings[i].month == this.chartData.labels[j]) {
              this.chartData.datasets[0].data[j] = this.bookings[i].count;
              console.log(this.bookings[i].month);
            }
          }
        }
        console.log("chart data: ", this.chartData.datasets[0].data);
        this.loaded = true;
      } catch (e) {
        console.error(e);
      }
    },
  },
  async mounted() {
    this.loaded = false;
    // await this.computeCharts();
    this.secondCompute();
  },
};
</script>
