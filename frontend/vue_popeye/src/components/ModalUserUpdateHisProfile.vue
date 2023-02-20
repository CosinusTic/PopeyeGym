<script setup>
import addressList from "./addressList.vue";
</script>

<script>
export default {
  components: {
    addressList,
  },
  data() {
    return {
      open: false,
      user: {},
      address: "",
      location: {},
      searchAddress: "",
      foundAddress: [],
      click: false,
      req_address: "",
    };
  },
  created() {
    this.user.name = this.User.name;
    this.user.email = this.User.email;
    this.address = this.User.address;
    this.location = this.User.location;
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  props: ["id", "name", "User"],
  methods: {
    async updateUser(id) {
      await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${this.address}&limit=1`
      )
        .then((response) => response.json())
        .then((data) => (this.req_address = data.features[0].properties.score));
      if (this.req_address > 0.97) {
        const options = {
          method: "PUT",
          body: JSON.stringify({
            name: this.user.name,
            address: this.address,
            email: this.user.email,
            location: this.location,
          }),
          headers: { "Content-Type": "application/json" },
        };
        await fetch("http://localhost:3002/updateUser/" + id, options).then(
          (response) => {
            console.log(response);
            this.open = false;
            this.$toast.success("Profile modified");
            console.log("MERDE =>", this.user);
            this.$emit("close", true, { ...this.user, _id: id });
          }
        );
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
      this.address = selectedAddress.properties.label;
      this.location = selectedAddress.geometry;
      console.log(selectedAddress.geometry);
      console.log(this.location);
      this.foundAddress = [];
    },
    close() {
      this.open = false;
    },
  },
};
</script>

<template>
  <div class="textUpdate" v-on:click="open = true">Update credentials</div>
  <div v-if="open" :class="{ modal: true, bgfitness: isFitness }">
    <div class="close">
      <button class="closeButton" @click="close()">X</button>
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
      <div class="mb-3" id="address">
        <input
          type="text"
          :class="{ inputchoice: true }"
          name="address"
          v-model="address"
          @input="getAddress"
        />
        <addressList :list="foundAddress" @address-selected="selectAnAddress" />
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
      <div class="final">
        <button
          :class="{ submitbutton: true, bgsubfitness: isFitness }"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
  font-weight: 300;
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
  top: 28.6%;
  left: 60.6%;
  height: 462px;
  width: 491px;
  background-color: #e73725;
  color: white;
  font-size: 16px;
  font-family: "Play", sans-serif;
  border-radius: 20px;
  padding: 20px;
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
  margin-top: 50px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  cursor: pointer;
}

.submitbutton:hover {
  opacity: 0.7;
}
.final {
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-top: 40px;
}

#address {
  margin-bottom: 40px;
}
.bgsubfitness {
  background-color: #2f6a87;
}

.textUpdate {
  cursor: pointer;
}

@media (max-width: 575.98px) {
  .modal {
    width: max-content;
    height: auto;
    top: 8%;
    left: 0%;
    right: 0;
    margin: 10% auto;
  }
}
</style>
