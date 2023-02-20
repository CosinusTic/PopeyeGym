<template>
  <div class="sideBar" :class="{ bgfitness: isFitness }">
    <button
      :class="{ bgbtfitness: isFitness }"
      v-on:click="redirectUserManagement()"
    >
      User management
    </button>
    <button
      :class="{ bgbtfitness: isFitness }"
      v-on:click="redirectCoachManagement()"
    >
      Coach management
    </button>
    <button
      :class="{ bgbtfitness: isFitness }"
      v-on:click="redirectAppointment()"
    >
      Appointments
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: undefined,
      coach_login: false,
    };
  },
  methods: {
    redirectDashboard() {
      this.$router.push("/admindashboard");
    },
    redirectUserManagement() {
      this.$router.push("/usermanagement");
    },
    redirectCoachManagement() {
      this.$router.push("/coachmanagement");
    },
    redirectAppointment() {
      this.$router.push("/adminappointment");
    },
  },
  async created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
};
</script>

<style scoped>
.sideBar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #404040;
  padding-top: 60px;
  width: 200px;
  height: 100vh;
  margin-right: 30px;
}

.bgfitness {
  background-color: #2f6a87;
}

.sideBar button {
  border-width: 0ch;
  height: 60px;
  width: 130px;
  border-radius: 20px;
  margin-bottom: 60px;
  background-color: #e73725;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  cursor: pointer;
}

.sideBar button:hover {
  opacity: 0.7;
}

.sideBar .bgbtfitness {
  background-color: #ea6c36;
}
</style>
