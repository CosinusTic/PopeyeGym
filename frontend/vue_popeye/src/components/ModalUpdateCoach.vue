<script setup>
import Axios from "axios";
</script>

<script>
export default {
  data() {
    return {
      open: false,
      user: {},
    };
  },
  props: {
    id: Number,
    token: String,
    coach: Object,
  },
  created(token) {
    console.log(token);
    fetch("http://localhost:3002/findUserWithToken/" + this.token)
      .then(function (res) {
        if (res.ok == true) {
          return res.json();
        }
      })
      .then((data) => {
        this.user = data.user[0];
        console.log("data du user unique", data);
      });
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  methods: {
    updateCoach(id) {
      Axios.put("http://localhost:3002/updateCoachByAdmin/" + id, {
        name: this.coach.name,
        email: this.coach.email,
        password: this.coach.password,
        description: this.coach.description,
        nature: this.coach.nature,
        photo: this.coach.photo,
        status: this.coach.status,
      }).then((response) => {
        console.log(response), (this.open = false);
      });
    },
  },
};
</script>

<template>
  <button
    :class="{ boutoncolor: true, bgbtfitness: isFitness }"
    v-on:click="open = true"
  >
    Edit
  </button>
  <div v-if="open" :class="{ modal: true, bgfitness: isFitness }">
    <div class="close">
      <button class="closeButton" @click="(e) => (open = false)">X</button>
    </div>
    <form @submit.prevent="updateCoach(id)">
      <label for="file" class="label">Name</label>
      <div class="mb-3">
        <input
          type="name"
          :class="{ inputchoice: true }"
          id="name"
          v-model="coach.name"
        />
      </div>
      <label for="price">Email</label>
      <div class="mb-3">
        <input
          type="email"
          :class="{ inputchoice: true }"
          id="email"
          v-model="coach.email"
        />
      </div>
      <label for="price">Description</label>
      <div class="mb-3">
        <textarea
          :class="{ inputchoice: true }"
          id="description"
          rows="3"
          cols="50"
          v-model="coach.description"
        ></textarea>
      </div>
      <label for="file">Nature</label>
      <div class="dropdown">
        <select v-model="coach.nature" :class="{ inputchoice: true }">
          <option disabled value="">Nature</option>
          <option value="crossfit">Crossfit</option>
          <option value="fitness">Fitness</option>
        </select>
      </div>
      <label for="price">Photo</label>
      <div class="mb-3">
        <input
          type="text"
          :class="{ inputchoice: true }"
          id="photo"
          v-model="coach.photo"
        />
      </div>
      <label for="file">Status</label>
      <div class="dropdown">
        <select v-model="coach.status" :class="{ inputchoice: true }">
          <option disabled value="">Status</option>
          <option value="0">Non Admin</option>
          <option value="1">Admin</option>
        </select>
        <div class="card-btn">
          <button
            type="submit"
            :class="{ submitbutton: true, bgbtfitness: isFitness }"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  display: block !important;
  text-align: left !important;
}
.closeButton {
  background: none;
  border: none;
  color: #e7e7e7;
  width: 40px;
  cursor: pointer;
}

.close {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.modal {
  position: fixed;
  z-index: 9999;
  top: 10%;
  min-height: 55%;
  left: 40%;
  width: 30%;
  background-color: #e73725;
  padding: 3%;
  color: white;
  font-size: 16px;
  font-family: "Play", sans-serif;
  border-radius: 20px;
}

.inputchoice {
  margin-bottom: 30px;
  border: none;
  height: 30px;
  background-color: #ffffff;
  opacity: 0.6;
}
.bgfitness {
  background-color: #ea6c36;
}

.submitbutton {
  background-color: #404040;
  border-width: 0ch;
  height: 50px;
  width: 140px;
  border-radius: 10px;
  margin-top: 20px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
}

.submitbutton:hover {
  opacity: 0.7;
  cursor: pointer;
}

.boutoncolor {
  background-color: #404040;
  margin-left: 10px;
  height: 30px;
  width: 60px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}
.boutoncolors {
  background-color: #404040;
  margin-left: 10px;
  margin-left: 50px;
  height: 40px;
  width: 80px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}

.boutoncolor:hover {
  opacity: 0.7;
  cursor: pointer;
}

#address {
  margin-bottom: 100px;
}

.bgbtfitness {
  background-color: #2f6a87;
}

.mb-3 input {
  width: 290px;
}
</style>
