<script setup>
import ProfileCoach from "../components/ProfileCoach.vue";

import MainHeaderComponent from "../components/MainHeaderComponent.vue";
</script>

<script>
export default {
  data() {
    return {
      coach: {},
      token: localStorage.getItem("token"),
      appointments: [],
      averageRate: undefined,
      refresh: false,
    };
  },
  methods: {
    async getUserType() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$router.push("/");
        this.$toast.error("User not logged in");
      }
      if (token) {
        await fetch("http://localhost:3002/getUserType/" + token)
          .then((response) => response.json())
          .then(async (response) => {
            localStorage.setItem("userType", await response.type);
          });
      } else {
        await fetch("http://localhost:3002/getUserType/" + this.token)
          .then((response) => response.json())
          .then(async (response) => {
            localStorage.setItem("userType", await response.type);
          });
      }
    },
    checkUserType() {
      const userType = localStorage.getItem("userType");

      if (userType == "coach") {
        return;
      } else if (userType == "customer") {
        this.$router.push("/");
        this.$toast.error("Access forbidden");
      }
    },
  },
  async created() {
    // request to GET one coach by token
    await this.getUserType();
    this.checkUserType();
    console.log("token =>", this.token);
    await fetch("http://localhost:3002/findCoachByToken/" + this.token)
      .then(function (res) {
        if (res.ok == true) {
          return res.json();
        }
      })
      .then((data) => {
        this.coach = data;
        console.log("coach in profile :", this.coach);
      })
      .then(async () => {
        await fetch(
          "http://localhost:3002/myAppointments/coach/" + this.coach._id
        )
          .then(function (result) {
            return result.json();
          })
          .then((data) => {
            this.appointments = data;
          })
          .then(async () => {
            const options = {
              method: "POST",
              body: JSON.stringify({
                coach_id: this.coach._id,
              }),
              headers: { "Content-Type": "application/json" },
            };
            await fetch("http://localhost:3002/averageRatingforCoach", options)
              .then((response) => response.json())
              .then((response) => (this.averageRate = response.avg));
          });
      });

    console.log("created");
  },
};
</script>

<template>
  <div>
    <MainHeaderComponent />
    <div>
      <ProfileCoach
        :id="coach._id"
        :token="coach.token"
        :name="coach.name"
        :email="coach.email"
        :description="coach.description"
        :nature="coach.nature"
        :busy="coach.busy"
        :rate="coach.rate"
        :photo="coach.photo"
        :appointments="appointments"
        :coach="coach"
        :avg="averageRate"
      />
    </div>
  </div>
</template>
