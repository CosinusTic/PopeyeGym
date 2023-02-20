<template>
  <MainHeaderComponentVue />
  <div class="user_profile">
    <div class="bookings">
      <h3>Appointements</h3>
      <div v-if="bookings.length > 0" class="my_bookings">
        <div v-for="booking in bookings" :key="booking">
          <label for="booking">
            <AppointmentComponent :booking="booking" />
          </label>
        </div>
      </div>
      <div v-else>
        <p class="no">No appointment</p>
      </div>
    </div>
    <div :class="{ userInformation: true, bgfitness: isFitness }">
      <h3>Informations</h3>
      <div class="info">
        <div class="head">Name :</div>
        <div class="text">{{ user.name }}</div>
        <div class="head">Email :</div>
        <div class="text">{{ user.email }}</div>
        <div class="head">My adress :</div>
        <div class="text">{{ user.address }}</div>
      </div>
      <button :class="{ boutoncolor: true, bgbtfitness: isFitness }">
        <ModalUserUpdateHisProfile
          :id="user._id"
          :name="user.name"
          :User="user"
          @close="(state, data) => $emit('close', state, data)"
        />
      </button>
    </div>
  </div>
</template>

<script>
import MainHeaderComponentVue from "./MainHeaderComponent.vue";
import ModalUserUpdateHisProfile from "./ModalUserUpdateHisProfile.vue";
import AppointmentComponent from "./AppointmentComponent.vue";

export default {
  props: ["user", "bookings"],
  components: {
    MainHeaderComponentVue,
    ModalUserUpdateHisProfile,
    AppointmentComponent,
  },
  data() {
    return {
      scheme: undefined,
      refresh: false,
    };
  },
  methods: {
    async refreshData(state, updatedUser) {
      if (state === true) {
        const userToupdateIndex = this.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        this.users[userToupdateIndex] = updatedUser;
      }
    },
    getScheme() {
      this.scheme = localStorage.getItem("scheme");
    },
  },
  created() {
    this.getScheme();
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
    console.log("this is booking", this.bookings);
  },
};
</script>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
  font-weight: 300;
}

.user_profile {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 100px;
}
.userInformation {
  border-radius: 20px;
  background-color: #404040;
  height: 500px;
  width: 500px;
  color: #ffffff;
  padding-left: 30px;
}

.userInformation h3 {
  font-size: 25px;
}

.info {
  padding-top: 30px;
  cursor: default;
}
.head {
  font-weight: bold;
  font-size: 18px;
}
.text {
  margin-bottom: 20px;
  font-size: 18px;
}

.boutoncolor {
  background-color: #e73725;
  border-width: 0ch;
  height: 50px;
  width: 140px;
  border-radius: 10px;
  margin-top: 50px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
}

.bookings {
  border: #404040 solid 1px;
  border-radius: 20px;
  min-height: 500px;
  width: 500px;
  padding-left: 30px;
}

.bookings h3 {
  font-size: 25px;
}

.no {
  text-align: center;
  margin-top: 60px;
  font-size: 20px;
}

.my_bookings{
  height: 500px;
  overflow-y: scroll;
}

.bgfitness {
  background-color: #2f6a87;
}

.bgbtfitness {
  background-color: #ea6c36;
}

h3,
p {
  cursor: default;
}
@media (max-width: 750px) {
  .user_profile {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
    justify-content: space-around;
    margin-top: 100px;
  }
}
</style>
