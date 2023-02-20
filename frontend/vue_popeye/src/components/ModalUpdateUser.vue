<script setup>
import Axios from "axios";
import AddressList from "../components/addressList.vue";
</script>

<script>
export default {
  data() {
    return {
      open: false,
      user: {},
      address: "",
      location: {},
      searchAddress: "",
      foundAddress: [],
      click: false,
      refresh: false,
      req_address: "",
    };
  },
  props: {
    id: Number,
    token: String,
  },
  created(token) {
    {
      console.log(token);
      fetch("http://localhost:3002/findUserWithToken/" + this.token)
        .then(function (res) {
          if (res.ok == true) {
            return res.json();
          }
        })
        .then((data) => {
          this.user = data.user[0];
          this.location = data.user[0].location;
          console.log("data du user unique", data);
        });
      if (localStorage.getItem("scheme") == "fitness") {
        this.isFitness = true;
      } else {
        this.isFitness = false;
      }
    }
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  methods: {
    async updateUser(id) {
      await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${this.user.address}&limit=1`
      )
        .then((response) => response.json())
        .then((data) => (this.req_address = data.features[0].properties.score));
      // console.log("COUCOU => ", this.req_address, this.req_address > 0.98)
      if (this.req_address > 0.98) {
        Axios.put("http://localhost:3002/updateUser/" + id, {
          name: this.user.name,
          address: this.user.address,
          email: this.user.email,
          status: this.user.status,
          location: this.location,
        }).then((response) => {
          console.log(response), (this.open = false);
          this.$emit("close", true, this.user);
        });
      } else {
        if (this.click !== true) {
          this.$toast.error("Bad address");
        }
      }
    },
    getAddress(event) {
      this.searchAddress = event.target.value;
      fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${this.searchAddress}&limit=5`
      )
        .then((response) => response.json())
        .then((data) => (this.foundAddress = data.features));
    },
    selectAnAddress(selectedAddress) {
      this.click = true;
      this.user.address = selectedAddress.properties.label;
      this.location = selectedAddress.geometry;
      this.foundAddress = [];
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
    <form @submit.prevent="updateUser(id)">
      <label for="file" class="label">Name</label>
      <div class="mb-3">
        <input
          type="name"
          :class="{ inputchoice: true }"
          id="name"
          v-model="user.name"
        />
      </div>
      <label for="file" class="label">Address</label>
      <div class="mb-3">
        <input
          type="text"
          :class="{ inputchoice: true }"
          id="address"
          name="address"
          v-model="user.address"
          @input="getAddress"
        />
        <AddressList :list="foundAddress" @address-selected="selectAnAddress" />
      </div>
      <label for="price" class="label">Email</label>
      <div class="mb-3">
        <input
          type="email"
          :class="{ inputchoice: true }"
          id="email"
          v-model="user.email"
        />
      </div>
      <label for="file">Status</label>
      <div class="dropdown">
        <select v-model="user.status" :class="{ inputchoice: true }">
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
  cursor: pointer;
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
.boutoncolor {
  background-color: #404040;
  margin-left: 10px;
  height: 30px;
  width: 60px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}

.boutoncolor:hover {
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

#address {
  margin-bottom: 100px;
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
