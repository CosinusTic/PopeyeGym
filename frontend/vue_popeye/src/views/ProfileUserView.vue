<template>
  <UserProfile :user="user" :bookings="this.bookings" @close="refreshData" />
</template>

<script>
import UserProfile from "../components/ProfileUser.vue";
export default {
  components: {
    UserProfile,
  },
  data() {
    return {
      user: undefined,
      bookings: undefined,
    };
  },
  methods: {
    async refreshData(state, data) {
      console.log("DATA => ", data);
      this.user = data;
    },
    async getUser() {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3002/findUserWithToken/" + token)
        .then((response) => response.json())
        .then((response) => {
          this.user = response.user[0];
        })
        .catch((error) => console.log(error));
    },
    async getBookings() {
      await fetch(
        "http://localhost:3002/v2/myAppointments/user/" + this.user._id
      )
        .then((response) => response.json())
        .then(async (response) => {
          this.bookings = await response;
          console.log(response);
        });
      console.log("get bookings called");
    },
    checkUserType() {
      const userType = localStorage.getItem("userType");
      const token = localStorage.getItem("token");

      if (userType == "customer") {
        return;
      } else if (userType == "coach") {
        this.$router.push("/");
        this.$toast.error("Access forbidden");
      } else if (!token) {
        this.$router.push("/");
        this.$toast.error("User not logged in");
      }
    },
  },

  async created() {
    this.checkUserType();
    await this.getUser();
    await this.getBookings();
    console.log(this.user);
  },
};
</script>
