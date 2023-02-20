<script setup>
import AppointmentChart from "../components/appointmentChart.vue";
import BestCoachesChart from "../components/bestCoachesChart.vue";
import MainHeaderComponent from "../components/MainHeaderComponent.vue";
import SideBarAdmin from "../components/SideBarAdmin.vue";
</script>

<script>
export default {
  data() {
    return {
      token: localStorage.getItem("token"),
      user_infos: {},
    };
  },
  created() {
    if (this.token) {
      // request to GET the connected user
      fetch("http://localhost:3002/findUserWithToken/" + this.token)
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          this.user_infos = data.user[0].status;
          if (this.user_infos == 0) {
            this.$router.push("/");
          }
        });
    } else {
      this.$router.push("/");
    }
  },
};
</script>

<template>
  <main>
    <MainHeaderComponent />
    <div class="container">
      <SideBarAdmin />
      <div class="charts">
        <div>
          <AppointmentChart />
        </div>
        <div>
          <BestCoachesChart />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  font-family: "poppins", sans-serif;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 5%;
  width: 100%;
}
.charts {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 100px;
  width: 100%;
}
</style>
