<script setup>
import ModalUpdateCoachProfile from "../components/ModalUpdateCoachProfile.vue";
defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  nature: {
    type: Number,
    required: true,
  },
  busy: {
    type: Array,
    required: false,
  },
  rate: {
    type: Array,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: true,
  },
  appointments: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  id_user: {
    type: String,
    required: true,
  },
  coach: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  avg: {
    type: Number,
    required: true,
  },
});
</script>

<script>
import BookAppointmentModalVue from "./BookAppointmentModal.vue";
import FilterComponent from "./FilterComponent.vue";
export default {
  components: {
    BookAppointmentModalVue,
    FilterComponent,
  },
  data() {
    return {
      rate: 0,
      element: "",
      openClientRegister: false,
      isFitness: false,
      rateFilters: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      rateInput: undefined,
      rateDisplayed: undefined,
      myAppointments: this.busy,
      newRate: 0,
    };
  },
  methods: {
    toggleRegisterClientModal(state) {
      console.log(this.openClientRegister);
      this.openClientRegister = state;
    },
    getRateFilter(event) {
      this.rateInput = event;
    },
    async rateCoach() {
      const options = {
        method: "PUT",
        body: JSON.stringify({
          coach_id: this.coach._id,
          user_id: this.user._id,
          rate: this.rateInput,
        }),
        headers: { "Content-Type": "application/json" },
      };
      await fetch("http://localhost:3002/rateCoach", options)
        .then((response) => response.json())
        .then(async (response) => {
          if (response.error) {
            if (response.error == "user already rated this coach") {
              let confirmation = confirm(
                "You already rated this coach, modify note for " +
                  this.coach.name +
                  " to " +
                  this.rateInput +
                  " ?"
              );

              if (confirmation) {
                await fetch("http://localhost:3002/modifyRate", options)
                  .then((response) => response.json())
                  .then((response) => {
                    console.log(response);
                    this.getAverage();
                    this.$toast.success("Rate modified!");
                  });
              }
            } else {
              this.$toast.error(response.error);
            }
          } else {
            this.getAverage();
            this.$toast.success("Rate added!");
          }
        });
    },
    async getAverage() {
      if (this.$route.path == "/mycoachprofile") {
        this.rateDisplayed = this.avg;
      } else {
        const options = {
          method: "POST",
          body: JSON.stringify({
            coach_id: this.coach._id,
          }),
          headers: { "Content-Type": "application/json" },
        };
        await fetch("http://localhost:3002/averageRatingforCoach", options)
          .then((response) => response.json())
          .then((response) => (this.rateDisplayed = response.avg));
      }
    },
    addAppointment(date) {
      this.myAppointments.push({ date, excuse: "Apptmt" });
    },
  },
  async created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }

    await this.getAverage();
  },
};
</script>

<template>
  <div :class="{ coach_profile: true, bgfitness: isFitness }">
    <div class="image_container"><img class="pic" :src="photo" /></div>
    <div class="coach_information">
      <div class="info1">
        <div class="head1">Name:</div>
        <div class="text">{{ name }}</div>
        <div class="head1">Email:</div>
        <div class="text">{{ email }}</div>
        <div class="head1">My description:</div>
        <div class="text">{{ description }}</div>
        <div class="head1">My coaching style:</div>
        <div class="text">{{ nature }}</div>
        <div v-if="this.$route.path == '/mycoachprofile'">
          <div v-if="avg != undefined" class="head1">
            My rate: {{ parseInt(avg) }} / 10
          </div>
          <div v-else class="head1">My rate: none</div>
        </div>
        <div v-else>
          <div v-if="rateDisplayed != undefined" class="head1">
            My rate: {{ parseInt(rateDisplayed) }} / 10
          </div>
          <div v-else class="head1">My rate: none</div>
        </div>
      </div>
    </div>
    <div class="coach_information2">
      <div class="info2">
        <div v-if="this.$route.name == 'all_coaches'">
          <div class="scroll">
            <div class="head">My unavailabilities:</div>
            <div v-if="{ busy } != null">
              <div class="text" v-for="element in busy" :key="element">
                {{ element.date }} - {{ element.excuse }}
              </div>
            </div>
            <div v-else>No unavailability</div>
          </div>
        </div>
        <div v-if="this.$route.name == 'coach_profile'">
          <div class="scroll">
            <div class="head">My unavailabilities:</div>
            <div v-if="{ busy } != null">
              <div class="text" v-for="element in busy" :key="element">
                <div v-if="element.excuse != 'Apptmt'">
                  {{ element.date }}
                </div>
              </div>
            </div>
            <div v-else>No unavailability</div>
          </div>
          <div class="scroll">
            <div class="head">My appointments:</div>
            <div v-if="{ element } == null" class="text">No appointment</div>
            <div v-else>
              <div v-for="element in appointments" :key="element">
                <div class="text">
                  {{ element.date }} with {{ element.user.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="this.$route.name == 'coach_profile'">
          <ModalUpdateCoachProfile />
        </div>
      </div>
      <div class="rate_coach" v-if="this.$route.path == '/allcoaches'">
        <FilterComponent
          @chosen_filter="getRateFilter"
          :filters="rateFilters"
          placeholder="Rate the coach"
          class="head1"
        />
        <button
          v-on:click="rateCoach"
          :class="{ submitbutton: true, bgbtfitness: isFitness }"
        >
          Rate
        </button>
      </div>
      <div v-if="openClientRegister == true">
        <BookAppointmentModalVue
          :coach="coach"
          @close-coach-register="toggleRegisterClientModal(false)"
          @new-appointment="addAppointment"
        />
      </div>
      <button
        @click="toggleRegisterClientModal(true)"
        v-if="this.$route.path == '/allcoaches'"
        :class="{
          bookAppointmentDefault: true,
          bookAppointmentFitness: isFitness,
        }"
      >
        <div class="text">Book appointment</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.coach_profile {
  display: flex;
  flex-direction: row;
  margin: 100px 20%;
  background-color: #404040;
  border-radius: 20px;
  justify-content: space-between;
  min-height: 500px;
}
.bookAppointmentDefault {
  border-radius: 10px;
  background-color: #e73725;
  width: 140px;
  height: 50px;
  border: none;
  margin: 10px;
  margin-bottom: 60px;
  cursor: pointer;
}
.bookAppointmentFitness {
  background-color: #ea6c36;
}
.bookAppointmentDefault:hover {
  opacity: 70%;
}
.bgfitness {
  background-color: #2f6a87;
}

.image_container {
  height: 400px;
  width: 300px;
  margin: 20px 0 20px 25px;
  padding: 50px 0;
}
.pic {
  /* width: 100%; */
  height: 100%;
}
.coach_information {
  height: 500px;
}
.coach_information2 {
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info1 {
  padding-top: 50px;
  max-width: 250px;
}
.info2 {
  padding-top: 50px;
  margin-right: 100px;
}
.head1 {
  font-weight: bolder;
  font-family: "Poppins", sans-serif;
  margin-top: 20px;
  margin-bottom: 5px;
  color: white;
}
.head {
  font-weight: bolder;
  font-family: "Poppins", sans-serif;
  padding-top: 20px;
  margin-bottom: 5px;
  color: white;
}
.text {
  font-family: "Poppins", sans-serif;
  margin-top: 3px;
  color: white;
}
.scroll {
  height: 150px;
  width: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-top: 15px;
}
.submitbutton {
  background-color: #ffffff;
  border-width: 0ch;
  height: 20px;
  width: 80px;
  border-radius: 10px;
  margin: 10px 10px;
  margin-bottom: 30px;
  color: #e73725;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  cursor: pointer;
}
.bgbtfitness {
  color: #ea6c36;
}

@media (max-width: 750px) {
  .image_container {
    contain: content;
    height: 200px;
    width: 100px;
    margin: 20px 0 20px 3%;
    padding: 50px 0;
  }
  .coach_profile {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 10px;
    background-color: #404040;
    border-radius: 20px;
    justify-content: space-between;
    min-height: 500px;
  }
  .bookAppointmentDefault {
    border-radius: 10px;
    background-color: #e73725;
    width: 140px;
    height: 50px;
    border: none;
    margin: 10px;
    margin-bottom: 60px;
    cursor: pointer;
  }
  .coach_information2 {
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 25%;
  }
  .coach_information {
    height: 0;
  }
  .info1 {
    padding-top: 50px;
    max-width: 250px;
    padding-right: 0px;
  }
}
</style>
