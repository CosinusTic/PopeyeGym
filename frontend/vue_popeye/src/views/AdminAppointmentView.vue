<script setup>
import MainHeaderComponent from "../components/MainHeaderComponent.vue";
</script>

<script>
import AdminForceAppointment from "../components/AdminForceAppointment.vue";
export default {
  components: {
    AdminForceAppointment,
  },
  data() {
    return {
      appointments: [],
      token: localStorage.getItem("token"),
      user_infos: {},
      users: undefined,
      openModal: true,
      isFitness: false,
    };
  },
  methods: {
    toggleOpen(state) {
      this.openModal = state;
    },
    async bookAppointment(appointment) {
      console.log(appointment);
      this.appointments.unshift({ ...appointment, newAppointment: true });
    },
    async deleteAppointment(appointment) {
      const options = {
        method: "DELETE",
        body: JSON.stringify({
          _id: appointment._id,
        }),
        headers: { "Content-Type": "application/json" },
      };
      const secondOptions = {
        method: "PUT",
        body: JSON.stringify({
          booking_date: appointment.date.split("T")[0],
          coach_id: appointment.coach.id,
        }),
        headers: { "Content-Type": "Application/json" },
      };
      await fetch("http://localhost:3002/deleteAppointment", options)
        .then((response) => response.json())
        .then(async (response) => {
          console.log(response.appointment_deleted);
          this.appointments = this.appointments.filter(
            (appointment) => appointment._id != response.appointment_deleted._id
          );
          await fetch("http://localhost:3002/freeCoachSchedule", secondOptions)
            .then((response) => response.json())
            .then((response) => {
              console.log(response);
              if (response["date freed"]) {
                this.$toast.success("Appointment successfully deleted");
              }
            })
            .catch((err) => {
              console.log(err);
              this.$toast.error(err);
            });
        })
        .catch((err) => console.log(err));
    },
  },
  async created() {
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
    if (localStorage.getItem("scheme") == "crossfit") {
      this.isFitness = false;
    } else {
      this.isFitness = true;
    }
    {
      // request to GET all appointments
      fetch("http://localhost:3002/appointmentsAndUsers")
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          this.appointments = data;
        });
    }
  },
};
</script>

<template>
  <main>
    <MainHeaderComponent />
    <h1 class="titre">Appointment Management</h1>
    <div class="main_page">
      <div :class="{ containerCrossfit: true, containerFitness: isFitness }">
        <div
          v-for="appointment in appointments"
          :key="appointment._id"
          :class="{
            proutCrossfit: true,
            proutFitness: isFitness,
            newAppointment: appointment.newAppointment,
          }"
        >
          <div>
            <div>
              <div class="top_row">
                <p class="fontcolor">
                  <span>User : </span>{{ appointment.user.name }}
                </p>
                <button
                  :class="{ btn: true, }"
                  v-on:click="deleteAppointment(appointment)"
                  name="bin"
                >
                  <img class="bin" src="../../public/bin.svg" alt="bin" />
                </button>
              </div>
              <p class="fontcolor">
                <span>User email : </span>{{ appointment.user.email }}
              </p>
            </div>
            <div>
              <p class="fontcolor">
                <span>Coach name : </span>{{ appointment.coach.name }}
              </p>
              <p class="fontcolor">
                <span>Coach email : </span>{{ appointment.coach.email }}
              </p>
            </div>
            <div>
              <p class="fontcolor">
                <span>Date : </span>{{ appointment.date.split("T")[0] }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="openModal == true">
        <AdminForceAppointment @force-appointment="bookAppointment" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  font-family: "poppins", sans-serif;
}

.main_page {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: space-around;
  margin-bottom: 20px;
}
.top_row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.fontcolor {
  color: #ffffff;
  margin: 5%;
}

span {
  font-weight: 700;
}

.btn {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-radius: 50%;
  margin: auto 10px;
  height: 20px;
  width: 20px;
}

.bgfitness {
  background-color: #2f6a87;
}
.proutCrossfit {
  margin: auto;
  margin-top: 2%;
  z-index: 9999999999999999;
  background-color: #404040;
  border-radius: 10px;
  width: 200px;
}
.proutFitness {
  background-color: #2f6a87;
}
.titre {
  text-align: center;
  margin-bottom: 70px;
  font-weight: 300;
  color: #404040;
}

.fontcolor {
  color: #ffffff;
  margin: 5%;
}

.fontcolor:hover {
  cursor: default;
}
.bin {
  width: 20px;
  height: 20px;
}
.bin:hover {
  cursor: pointer;
}
.containerCrossfit {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
  height: 500px;
  overflow-y:scroll;
  border: solid 2px #e73725;
  margin-left: 1%;
  padding-bottom: 1%;
  border-radius: 20px;
  align-items: center;
}
.containerFitness {
  border: solid 2px #ea6c36;
}

.newAppointment:first-child {
  background-color: #5F8D4E !important;
}
</style>
