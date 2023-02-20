<script setup>
import Axios from "axios";
</script>

<script>
export default {
  data() {
    return {
      open: false,
      element: "",
      dateBusy: undefined,
      token: localStorage.getItem("token"),
      input: undefined,
      busy: [],
    };
  },
  props: {
    id: Number,
  },
  created(token) {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
    {
      fetch("http://localhost:3002/findCoachByToken/" + this.token)
        .then(function (res) {
          if (res.ok == true) {
            return res.json();
          }
        })
        .then((data) => {
          (this.coach = data), console.log(token);
          this.busy = this.coach.busy;
        })
        .then(() => {
          fetch("http://localhost:3002/myAppointments/coach/" + this.coach._id)
            .then(function (result) {
              return result.json();
            })
            .then((data) => {
              this.appointments = data;
            });
        });
    }
  },
  methods: {
    updateCoach(token) {
      Axios.put("http://localhost:3002/updateCoach/" + this.token, {
        id: this.coach._id,
        name: this.coach.name,
        email: this.coach.email,
        description: this.coach.description,
        nature: this.coach.nature,
        busy: { date: this.dateBusy, excuse: "occupied" },
        rate: this.coach.rate,
        photo: this.coach.photo,
      }).then((response) => {
        console.log(response), console.log(token), (this.open = false);
        this.$emit("close", true, this.coach);
      });
    },
    async deleteDate(element) {
      this.input = window.confirm("Are you sure you want to delete?");
      if (this.input === true) {
        await fetch("http://localhost:3002/deleteDate/" + this.token, {
          method: "DELETE",
          body: JSON.stringify({
            busy: {
              date: new Date(element.date).toLocaleDateString(),
              excuse: element.excuse,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (res) => {
          this.busy = await res.json();
          this.coach.busy = this.busy;
        });
      }
    },
    async deleteAppointment(element) {
      this.input = window.confirm(
        "Are you sure you want to delete your appointment with " +
          element.user.name +
          "?"
      );
      if (this.input === true) {
        await fetch(
          "http://localhost:3002/deleteAppointment/" + element.appointment_id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          console.log(res);
        });
      }
    },
    async submit() {
      window.location.reload(),
        localStorage.setItem("scheme", this.coach.nature);
    },
  },
};
</script>

<template>
  <button :class="{ button: true, bgbtfitness: isFitness }">
    <div class="open" @click="open = true">Update my profile</div>
  </button>
  <div v-if="open" :class="{ modal: true, modalFitness: isFitness }">
    <div class="cross">
      <button type="button" @click="open = false" class="cancel-btn">X</button>
    </div>
    <form class="coach_profile" @submit.prevent="updateCoach(token)">
      <div>
        <label for="photo" class="title">My profile picture</label>
        <div>
          <input
            type="text"
            class="form-control box"
            id="photo"
            v-model="coach.photo"
          />
        </div>
        <label for="name" class="title">Name</label>
        <div class="mb-3">
          <input
            type="name"
            class="form-control box"
            id="name"
            v-model="coach.name"
          />
        </div>
        <label class="title" for="email">Email</label>
        <div class="mb-3">
          <input
            type="email"
            class="form-control box"
            id="email"
            v-model="coach.email"
          />
        </div>
        <label class="title" for="description">Description</label>
        <div class="mb-3">
          <input
            type="textarea"
            class="form-control box"
            id="description"
            v-model="coach.description"
          />
        </div>
        <label class="title" for="nature">Coaching style</label>
        <div class="dropdown">
          <select v-model="coach.nature">
            <option disabled value="">My style</option>
            <option value="crossfit">Crossfit</option>
            <option value="fitness">Fitness</option>
          </select>
        </div>
      </div>
      <div>
        <div class="espacements">
          <label class="title" for="busy">My unavailabilities</label>
          <div class="mb-3" v-for="element in busy" :key="element">
            <div v-if="element.excuse != 'Apptmt'">
              <input
                type="checkbox"
                class="form-control checkbox"
                id="date"
                :value="element"
                @change="deleteDate(element)"
              />
              {{ element.date }}
            </div>
          </div>
        </div>
        <div class="espacements">
          <label class="title" for="busy">My appointments</label>
          <div class="mb-3" v-for="element in appointments" :key="element">
            <input
              type="checkbox"
              class="form-control checkbox"
              id="date"
              :value="element.date"
              @change="deleteAppointment(element)"
            />
            {{ element.date }} - {{ element.user.name }}
          </div>
        </div>
        <div class="espacements">
          <label class="title" for="busy">Add unavailabilities</label>
          <div class="mb-3">
            <input
              type="date"
              class="form-control box"
              id="date"
              v-model="dateBusy"
            />
          </div>
        </div>
      </div>
      <div class="card-btn">
        <button
          type="submit"
          @click="submit()"
          :class="{ submit_btn: true, submit_btnfitness: isFitness }"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.coach_profile {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.modal {
  position: fixed;
  z-index: 9999;
  top: 29.3%;
  height: 410px;
  left: 29.7%;
  width: 54.2%;
  margin-left: -150px;
  display: block;
  background-color: #e73725;
  padding: 3%;
  color: white;
  font-size: 15px;
  border-radius: 20px;
  margin-top: 26px;
  font-family: "Poppins", sans-serif;
}

button {
  border-radius: 10px;
  background-color: #e73725;
  width: 140px;
  height: 50px;
  border: none;
  margin: 10px;
  margin-bottom: 60px;
  cursor: pointer;
}

.bgbtfitness {
  background-color: #ea6c36;
}
.title {
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
}
.card-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.open {
  color: white;
  font-family: "Poppins", sans-serif;
}
.modalFitness {
  background-color: #ea6c36;
}
.submit_btn {
  background-color: #404040;
  color: white;
  margin-top: 340px;
}

.submit_btn:hover {
  opacity: 0.8;
}

.cancel-btn {
  color: white;
  margin-bottom: 0 !important;
  height: 20px !important;
  background: none !important;
}
.cross {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.dropdown {
  opacity: 0.6;
  border: none;
  margin-bottom: 30px;
  height: 30px;
}
.box {
  opacity: 0.6;
  border: none;
  margin-bottom: 30px;
  height: 25px;
  margin-top: 5px;
  width: 280px;
}
.checkbox {
  opacity: 0.6;
  border: none;
  margin-bottom: 30px;
  margin-top: 5px;
}
.submit_btnfitness {
  background-color: #2f6a87;
}

.espacements {
  margin-bottom: 5px;
}

@media (max-width: 575.98px) {
  .modal {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    z-index: 9999;
    top: -866px;
    height: auto;
    width: auto;
    margin-left: -151px;
    margin-right: -19px;
    display: block;
    background-color: #e73725;
    color: white;
    font-size: 15px;
    border-radius: 20px;
    font-family: "Poppins", sans-serif;
  }
  .coach_profile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .submit_btn {
    background-color: #404040;
    color: white;
    margin-top: 0px;
  }
}
</style>
