<script setup>
import ProfileCoach from "../components/ProfileCoach.vue";
import HeaderComponent from "../components/MainHeaderComponent.vue";
</script>

<script>
export default {
  data() {
    return {
      coaches: [],
      scheme: localStorage.getItem("scheme"),
      state: "",
      user: undefined,
    };
  },
  methods: {
    async getConnectedUser() {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3002/findUserWithToken/" + token)
        .then((response) => response.json())
        .then((response) => {
          this.user = response.user[0];
        });
    },
    toggleRegisterClientModal(state) {
      this.openClientRegister = state;
    },
    checkUserType(){
      const userType = localStorage.getItem("userType");
      const token = localStorage.getItem('token');

      if(userType == "customer"){
        return
      }
      else if(userType == "coach"){
        this.$router.push('/');
        this.$toast.error('Access forbidden');
      }
      else if(!token){
        this.$router.push('/');
        this.$toast.error('User not logged in');
      }
    }
  },
  async created(scheme) {
    // request to GET all coaches
    console.log(scheme);
    this.checkUserType();
    fetch("http://localhost:3002/findAllCoaches/" + this.scheme)
      .then(function (res) {
        if (res.ok == true) {
          return res.json();
        }
      })
      .then((data) => {
        this.coaches = data;
      });
    await this.getConnectedUser();
  },
};
</script>

<template>
  <HeaderComponent />
  <div v-for="coach in coaches" :key="coach" class="col">
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
      :coach="coach"
      :user="user"
    />
  </div>
</template>

<style scoped></style>
