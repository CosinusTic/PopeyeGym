<script setup>
import Axios from "axios";
</script>

<script>
export default {
  data() {
    return {
      open: false,
      coach: {},
    };
  },
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  methods: {
    createCoachByAdmin() {
      Axios.post("http://localhost:3002/createCoachByAdmin", {
        name: this.coach.name,
        email: this.coach.email,
        password: this.coach.password,
        description: this.coach.description,
        nature: this.coach.nature,
        photo: this.coach.photo,
        status: this.coach.status,
      }).then((response) => {
        console.log(response), (this.open = false);
        window.location.reload();
      });
    },
  },
};
</script>

<template>
  <button
    :class="{ boutoncolors: true, bgbtfitness: isFitness }"
    v-on:click="(e) => (open = true)"
  >
    Create
  </button>
  <div v-if="open" :class="{ modal: true, bgfitness: isFitness }">
    <div class="close">
      <button class="closeButton" @click="(e) => (open = false)">X</button>
    </div>
    <form @submit.prevent="createCoachByAdmin()">
      <label for="file" class="label">Name</label>
      <div class="mb-3">
        <input
          type="name"
          :class="{ inputchoice: true }"
          class="form-control box"
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
      <label for="price">Password</label>
      <div class="mb-3">
        <input
          type="password"
          :class="{ inputchoice: true }"
          id="password"
          v-model="coach.password"
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
}

.closeButton:hover {
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
  cursor: pointer;
  opacity: 0.7;
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

.boutoncolors:hover {
  cursor: pointer;
  opacity: 0.7;
}

#address {
  margin-bottom: 50px;
}

.bgbtfitness {
  background-color: #2f6a87;
}

.mb-3 input {
  width: 290px;
}

@media (max-width: 575.98px) {
  .modal {
    width: 80vw;
    height: auto;
    left: 0;
    right: 0;
    margin: 10% auto;
  }
}
.cancel-btn {
  background-color: black;
  color: #fff;
  border: 0 none;
  width: 6em;
  padding: 0.3em 1em;
}
.submit-btn {
  background-color: #6eb2cc;
  border: 0 none;
  color: #fff;
  width: 6em;
  margin-right: 3%;
}
.card-btn {
  display: flex;
  justify-content: right;
  margin-top: 1em;
}
select {
  border: 0 none;
  padding: 0.375rem 0.75rem;
}
.update:hover {
  fill: var(--bs-mainColor3);
  cursor: pointer;
}
</style>
